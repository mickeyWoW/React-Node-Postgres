import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from 'app/user/user.model';
import { WorkOrder } from 'app/workOrder/workOrder.model';

@Entity('pods')
export class Pod {
  @PrimaryGeneratedColumn() id!: number;
  @Column() name!: string;
  @Column() updatedAt!: Date;
  @Column() createdAt!: Date;

  @OneToMany(() => User, (user) => user.pod)
  users?: User[];

  @OneToMany(() => WorkOrder, (workOrder) => workOrder.pod)
  workOrders?: WorkOrder[];
}
