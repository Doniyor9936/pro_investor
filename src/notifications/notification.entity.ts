import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    subject: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'enum', enum: ['email'], default: 'email' })
    type: string;

    @Column({ default: false })
    isSent: boolean;

    @Column({ type: 'timestamp', nullable: true })
    sentAt: Date;

    @Column({ type: 'text', nullable: true })
    errorMessage: string | null;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    // Relations
    @ManyToOne(() => User, (user) => user, { nullable: true })
    user: User;

    @Column({ nullable: true })
    userId: number | null;
}