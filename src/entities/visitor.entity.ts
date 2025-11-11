import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  
} from 'typeorm';
import { VisitorStatus } from 'src/enums/visitor-status.enum';
import { User } from './user.entity';
import { Operator } from './operator.entity';

@Entity()
@Index(['passNumber'])
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  visitorId: string;

@ManyToOne(() => Operator, (op) => op.visitors, { nullable: false })
@JoinColumn({ name: 'operatorId' })
operator: Operator;

  @Column()
  passNumber: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  icNumber: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ type: 'enum', enum: VisitorStatus, default: VisitorStatus.CHECKED_IN })
  status: VisitorStatus;

  @Column({ type: 'timestamp', nullable: true })
  checkInAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  checkOutAt: Date | null;

  // FK -> user.id (nullable)
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  createdByUser: User | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
