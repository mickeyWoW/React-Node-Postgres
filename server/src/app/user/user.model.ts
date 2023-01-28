import { Task } from 'app/task/task.model';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserSkill } from 'app/userSkills/userSkill.model';
import { Pod } from 'app/pod/pod.model';
import { Skill } from 'app/skills/skill.model';

export const userColumns = [
  'id',
  'firstName',
  'lastName',
  'email',
  'password',
  'isActive',
  'address1',
  'address2',
  'city',
  'state',
  'zip',
  'phone',
  'podId',
  'adminVerified',
  'resetPasswordToken',
  'resetPasswordExpiresAt',
  'updatedAt',
  'createdAt',
] as const;

@Entity('users')
export class User {
  @PrimaryGeneratedColumn() id!: number;
  @Column() firstName!: string;
  @Column() lastName!: string;
  @Column() email!: string;
  @Column() password?: string;
  @Column() isActive!: boolean;
  @Column() address1!: string;
  @Column() address2?: string;
  @Column() city!: string;
  @Column() state!: string;
  @Column() zip!: string;
  @Column() phone!: string;
  @Column() podId!: number;
  @Column() adminVerified!: boolean;

  @Column() resetPasswordToken?: string;
  @Column() resetPasswordExpiresAt?: Date;

  @Column() updatedAt!: Date;
  @Column() createdAt!: Date;

  @ManyToOne(() => Pod, (pod) => pod.users) pod?: Pod;

  @OneToMany(() => UserSkill, (us) => us.user, {
    cascade: true,
  })
  userSkills?: UserSkill[];

  @ManyToMany(() => Skill)
  @JoinTable({
    name: 'userSkills',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skillId', referencedColumnName: 'id' },
  })
  skills?: Skill[];

  @OneToMany(() => Task, (task) => task.user)
  tasks?: Task[];
}
