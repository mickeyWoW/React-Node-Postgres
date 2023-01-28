import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn() id!: number;
  @Column() email!: string;
  @Column() firstName!: string;
  @Column() lastName!: string;
  @Column() password?: string;
  @Column() isActive: boolean;
  @Column() resetPasswordToken?: string;
  @Column() resetPasswordExpiresAt?: Date;
}
