import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WorkOrder } from 'app/workOrder/workOrder.model';
import { User } from 'app/user/user.model';

export enum TaskStatus {
  active = 'Active',
  inReview = 'In Review',
  approved = 'Approved',
  rejected = 'Rejected',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn() id: number;
  @Column() claimedQuantity: number;
  @Column({ default: TaskStatus.active }) status: TaskStatus;
  @Column({ default: 0 }) completedQuantity: number;
  @Column({ nullable: true }) completedOnTime?: boolean;
  @Column() updatedAt: Date;
  @Column() createdAt: Date;

  @Column() userId!: number;
  @ManyToOne(() => User, (user) => user.tasks)
  user!: User;

  @Column() workOrderId!: number;
  @ManyToOne(() => WorkOrder, (work) => work.tasks)
  workOrder!: WorkOrder;
}
