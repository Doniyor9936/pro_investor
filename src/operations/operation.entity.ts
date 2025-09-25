import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Account } from '../accounts/account.entity';

@Entity('operations')
export class Operation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: ['deposit', 'withdrawal', 'profit'], })
    type: string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ type: 'text',nullable:true })
    cardNumber: string;


    @Column({ type: 'varchar',nullable:true })
    status: string;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    // Relations
    @ManyToOne(() => User, (user) => user.operations)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @ManyToOne(() => Account, (account) => account.operations, { nullable: true })
    account: Account;

    @Column({ nullable: true })
    accountId: number;

    @Column({ type: 'json', nullable: true })
    withdrawalDetails: object;

    @Column({ type: 'varchar', nullable: true })
    emailCode?: string;

    @Column({ type: 'timestamp', nullable: true })
    emailCodeExpiresAt?: Date;


}