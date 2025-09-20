import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
// import { Operation } from '../operations/operations.entity';

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  accountNumber: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalProfit: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  profitPercentage: number;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE
  })
  status: AccountStatus;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  managementFee: number; // Boshqaruv komissiyasi

  @Column({ type: 'int' })
  userId: number;

  // @ManyToOne(() => User, user => user.accounts)
  // @JoinColumn({ name: 'userId' })
  // user: User;

  // @OneToMany(() => Operation, operation => operation.account)
  // operations: Operation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}