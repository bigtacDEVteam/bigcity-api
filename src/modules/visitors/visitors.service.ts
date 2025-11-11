import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { Visitor } from 'src/entities/visitor.entity';
import { VisitorStatus } from 'src/enums/visitor-status.enum';

const MY_ZONE = 'Asia/Kuala_Lumpur';
const toOpId = (val: string | number) => (typeof val === 'string' ? parseInt(val, 10) : val);

@Injectable()
export class VisitorsService {
  constructor(
    @InjectRepository(Visitor)
    private readonly visitorRepo: Repository<Visitor>,
  ) {}

  async checkIn(
    operatorId: string | number,
    userId: number | null,
    dto: {
      passNumber: string;
      name?: string;
      phone?: string;
      company?: string;
      icNumber?: string;
      department?: string;
      photoUrl?: string;
    },
  ) {
    const opId = toOpId(operatorId);

    const exists = await this.visitorRepo.findOne({
      where: {
        operator: { id: opId },
        passNumber: dto.passNumber.trim(),
        status: VisitorStatus.CHECKED_IN,
      },
    });
    if (exists) throw new BadRequestException('Pass already checked-in');

    const entity = this.visitorRepo.create({
      operator: { id: opId } as any,
      passNumber: dto.passNumber.trim(),
      name: dto.name?.trim(),
      phone: dto.phone?.trim(),
      company: dto.company?.trim(),
      icNumber: dto.icNumber?.trim(),
      department: dto.department?.trim(),
      photoUrl: dto.photoUrl?.trim(),
      status: VisitorStatus.CHECKED_IN,
      checkInAt: new Date(), // UTC
      checkOutAt: null,
      createdByUser: userId ? ({ id: userId } as any) : null,
    });

    const newVisitor = await this.visitorRepo.save(entity);
    return this.toMYT(newVisitor);
  }

  async checkOut(operatorId: string | number, passNumber: string) {
    const opId = toOpId(operatorId);

    const active = await this.visitorRepo.findOne({
      where: {
        operator: { id: opId },
        passNumber: passNumber.trim(),
        status: VisitorStatus.CHECKED_IN,
      },
    });
    if (!active) throw new NotFoundException('Active pass not found');

    active.status = VisitorStatus.CHECKED_OUT;
    active.checkOutAt = new Date(); // UTC
    const updatedVisitor = await this.visitorRepo.save(active);
    return this.toMYT(updatedVisitor);
  }

  async list(
    operatorId: string | number,
    query: {
      status?: VisitorStatus;
      q?: string;
      from?: string; // YYYY-MM-DD (MYT)
      to?: string;   // YYYY-MM-DD (MYT)
      page?: number;
      limit?: number;
      sort?: string; // e.g. checkInAt:desc
    },
  ) {
    const opId = toOpId(operatorId);
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, query.limit ?? 20);

    // use FK column in QB
    const qb = this.visitorRepo
      .createQueryBuilder('v')
      .where('v.operatorId = :operatorId', { operatorId: opId });

    if (query.status) qb.andWhere('v.status = :status', { status: query.status });

    if (query.q) {
      const like = `%${query.q.trim()}%`;
      qb.andWhere('(v.passNumber LIKE :like OR v.name LIKE :like OR v.phone LIKE :like)', { like });
    }

    if (query.from) {
      const fromIso = DateTime.fromISO(query.from, { zone: MY_ZONE }).startOf('day').toUTC().toISO();
      qb.andWhere('v.checkInAt >= :from', { from: fromIso });
    }
    if (query.to) {
      const toIso = DateTime.fromISO(query.to, { zone: MY_ZONE }).endOf('day').toUTC().toISO();
      qb.andWhere('v.checkInAt <= :to', { to: toIso });
    }

    const [field, dirRaw] = (query.sort ?? '').split(':');
    const allowed = new Set(['checkInAt', 'checkOutAt', 'createdAt', 'passNumber', 'name']);
    const direction = dirRaw?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    if (allowed.has(field)) qb.orderBy(`v.${field}`, direction as 'ASC' | 'DESC');
    else qb.orderBy('v.checkInAt', 'DESC');

    qb.skip((page - 1) * limit).take(limit);

    const [rows, total] = await qb.getManyAndCount();
    return {
      meta: { page, limit, total },
      items: rows.map((r) => this.toMYT(r)),
    };
  }

  private toMYT(v: Visitor) {
    const toMY = (d?: Date | null) => (d ? DateTime.fromJSDate(d).setZone(MY_ZONE).toISO() : null);

    const operatorId = v.operator?.id ?? (v as any).operatorId ?? null;
    const createdBy = v.createdByUser?.id ?? (v as any).createdBy ?? null;

    return {
      visitorId: v.visitorId,
      operatorId,
      passNumber: v.passNumber,
      name: v.name,
      phone: v.phone,
      company: v.company,
      icNumber: v.icNumber,
      department: v.department,
      photoUrl: v.photoUrl,
      status: v.status,
      checkInAt: toMY(v.checkInAt),
      checkOutAt: toMY(v.checkOutAt),
      createdAt: toMY(v.createdAt),
      updatedAt: toMY(v.updatedAt),
      createdBy,
    };
  }
}
