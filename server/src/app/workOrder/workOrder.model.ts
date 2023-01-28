import { Task } from 'app/task/task.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkOrderSkill } from 'app/workOrderSkills/workOrderSkill.model';
import { Pod } from 'app/pod/pod.model';

export const workOrderColumns = [
  'id',
  'podId',
  'name',
  'productSku',
  'timeEstimateMin',
  'timeEstimateMax',
  'minTaskQuantity',
  'maxTaskQuantity',
  'endDate',
  'paymentTerms',
  'totalQuantity',
  'completedQuantity',
  'instructionsPdfLink',
  'instructionsVideoLink',
  'postSignupInstructions',
  'updatedAt',
  'createdAt',
] as const;

export enum WorkOrderStatus {
  active = 'active',
  inactive = 'inactive',
  complete = 'complete',
}

@Entity('workOrders')
export class WorkOrder {
  @PrimaryGeneratedColumn() id!: number;

  @Column() podId!: number;
  @Column() name!: string;
  @Column() productSku!: string;
  @Column() timeEstimateMin!: number;
  @Column() timeEstimateMax!: number;
  @Column() minTaskQuantity!: number;
  @Column() maxTaskQuantity!: number;
  @Column() endDate!: Date;
  @Column() paymentTerms!: number;
  @Column() paymentStatus!: string;
  @Column() totalQuantity!: number;
  @Column() completedQuantity!: number;
  @Column() instructionsPdfLink!: string;
  @Column() instructionsVideoLink!: string;
  @Column() postSignupInstructions!: string;

  @Column({
    type: 'enum',
    enum: WorkOrderStatus,
    default: WorkOrderStatus.active,
  })
  status!: 'active' | 'inactive' | 'complete';

  @Column() updatedAt!: Date;
  @Column() createdAt!: Date;

  @ManyToOne(() => Pod, (pod) => pod.id) pod?: Pod;

  @OneToMany(() => WorkOrderSkill, (wos) => wos.workOrder, {
    cascade: true,
  })
  workOrderSkills?: WorkOrderSkill[];

  @OneToMany(() => Task, (task) => task.workOrder)
  tasks?: Task[];
}
