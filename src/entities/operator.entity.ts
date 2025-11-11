import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
  CreateDateColumn, UpdateDateColumn, Index
} from 'typeorm';
import { User } from './user.entity';
import { Visitor } from './visitor.entity';

@Entity()
export class Operator {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  name: string; // display name (“Menara ABC”)

  @Column({ nullable: true }) address: string;
  @Column({ nullable: true }) description: string;
  @Column({ nullable: true }) email: string;
  @Column({ nullable: true }) phoneNo: string;
  @Column({ nullable: true }) imageMeta: string;

  @OneToMany(() => User, (u) => u.operator)
  users: User[];

  @OneToMany(() => Visitor, (v) => v.operator)
  visitors: Visitor[];

  @CreateDateColumn({ type: 'timestamp' }) createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' }) updatedAt: Date;
}
