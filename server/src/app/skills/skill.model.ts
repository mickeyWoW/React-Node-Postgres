import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { WorkOrderSkill } from 'app/workOrderSkills/workOrderSkill.model';
import { UserSkill } from 'app/userSkills/userSkill.model';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn() id!: number;
  @Column() name!: string;
  @Column() updatedAt!: Date;
  @Column() createdAt!: Date;

  @OneToMany(() => UserSkill, (userSkill) => userSkill.skill)
  userSkills?: UserSkill[];

  @OneToMany(() => WorkOrderSkill, (workOrderSkill) => workOrderSkill.skill)
  workOrderSkills?: WorkOrderSkill[];
}
