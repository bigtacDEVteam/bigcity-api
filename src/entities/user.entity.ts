import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { YesOrNo } from 'src/enums/yes-or-no.enum';
import { Roles } from 'src/enums/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  uId: string;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  email: string;

  @Column({
    type: 'enum',
    enum: Roles,
  })
  role: Roles;

  @Column({
    nullable: true,
  })
  phoneNo: string;

  @Column({
    nullable: true,
  })
  addressLine1: string;

  @Column({
    nullable: true,
  })
  addressLine2: string;

  @Column({
    type: 'enum',
    enum: YesOrNo,
  })
  isEmailVerified: YesOrNo;

  @Column({
    nullable: true,
    type: 'text',
  })
  pendingAdminApproval: string | null;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

}
