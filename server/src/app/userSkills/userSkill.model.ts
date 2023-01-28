import { Skill } from 'app/skills/skill.model';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'app/user/user.model';

@Entity('userSkills')
export class UserSkill {
  @PrimaryGeneratedColumn() id!: number;

  @Column() userId!: number;
  @Column() skillId!: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Skill, (skill) => skill.id)
  @JoinColumn()
  skill!: Skill;
}
