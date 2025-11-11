import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { CheckInVisitorDto } from './dto/check-in.dto';
import { CheckOutVisitorDto } from './dto/check-out.dto';
import { GetVisitorsQueryDto } from './dto/get-visitors.query';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { User as UserDeco } from 'src/decorators/user.decorator';
import { Roles } from 'src/enums/roles.enum';

@UseGuards(AccessTokenGuard)
@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post('check-in')
  async checkIn(
    @UserDeco() user: any,
    @Body() dto: CheckInVisitorDto,
    @Query('operatorId') operatorIdParam?: string,
  ) {
    const operatorId = user.role === Roles.SUPERADMIN ? operatorIdParam : user.operatorId;
    if (!operatorId) throw new Error('operatorId required');
    return this.visitorsService.checkIn(operatorId, user?.id ?? null, dto);
  }

  @Post('check-out')
  async checkOut(
    @UserDeco() user: any,
    @Body() dto: CheckOutVisitorDto,
    @Query('operatorId') operatorIdParam?: string,
  ) {
    const operatorId = user.role === Roles.SUPERADMIN ? operatorIdParam : user.operatorId;
    if (!operatorId) throw new Error('operatorId required');
    return this.visitorsService.checkOut(operatorId, dto.passNumber);
  }

  @Get()
  async list(
    @UserDeco() user: any,
    @Query() query: GetVisitorsQueryDto,
    @Query('operatorId') operatorIdParam?: string,
  ) {
    const operatorId = user.role === Roles.SUPERADMIN ? operatorIdParam : user.operatorId;
    if (!operatorId) throw new Error('operatorId required');
    return this.visitorsService.list(operatorId, query as any);
  }
}
