import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { YesOrNo } from 'src/enums/yes-or-no.enum';

@Entity()
export class AdminOperators {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buildingName: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNo: string;

  @Column({
    type: 'enum',
    enum: YesOrNo,
  })
  isActive: YesOrNo;

  @Column({ nullable: true })
  imageMeta: string;

//   @OneToMany(() => User, (user) => user.operator)
//   users: User[];

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;
}
