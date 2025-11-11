import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, JoinColumn
} from 'typeorm';
import { YesOrNo } from 'src/enums/yes-or-no.enum';
import { Roles } from 'src/enums/roles.enum';
import { Operator } from './operator.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Operator, (op) => op.users, { nullable: true })
  @JoinColumn({ name: 'operatorId' })
  operator: Operator;
@Column({ type: 'int', nullable: true })
operatorId: number | null;
  @Column({ type: 'char', length: 36, unique: true, default: () => 'UUID()' })
  uId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'enum', enum: Roles })
  role: Roles;

  @Column({ nullable: true })
  phoneNo: string;

  @Column({ nullable: true })
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column({ type: 'enum', enum: YesOrNo, default: YesOrNo.NO })
  isEmailVerified: YesOrNo;

  @Column({ nullable: true, type: 'text' })
  pendingAdminApproval: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
