// src/accounts/account.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Operation } from '../operations/operation.entity';

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    accountNumber: string;

    @Column({ type: 'varchar', length: 3, default: 'RUB' })
    currency: string;

    @Column({ nullable: true })
    bikOrBank: string;

    @Column({ nullable: true })
    bankName: string;

    @Column({ nullable: true })
    inn: string;

    @Column({ nullable: true })
    kpp: string;

    @Column({ nullable: true })
    corrAccount: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    balance: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    profit: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    profitPercentage: number;

    @Column({ type: 'enum', enum: ['active', 'suspended', 'closed'], default: 'active' })
    status: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    // Relations
    @ManyToOne(() => User, (user) => user.accounts)
    user: User;

    @Column()
    userId: number;

    @OneToMany(() => Operation, (operation) => operation.account)
    operations: Operation[];
    number: string;
}