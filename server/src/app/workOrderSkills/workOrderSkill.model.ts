import { Skill } from 'app/skills/skill.model';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkOrder } from 'app/workOrder/workOrder.model';

@Entity('workOrderSkills')
export class WorkOrderSkill {
  @PrimaryGeneratedColumn() id!: number;

  @Column() workOrderId!: number;

  @Column() skillId!: number;

  @ManyToOne(() => WorkOrder, (wo) => wo.id)
  @JoinColumn()
  workOrder!: WorkOrder;

  @ManyToOne(() => Skill, (skill) => skill.id)
  @JoinColumn()
  skill!: Skill;

  // @OneToOne(() => UserSkill, (userSkill) => userSkill.skillId)
  // @JoinColumn({ name: 'skillId' })
  // userSkill?: UserSkill;
}
