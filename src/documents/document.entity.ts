import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('documents')
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fileName: string;

    @Column()
    filePath: string;

    @Column({ type: 'enum', enum: ['passport', 'selfie', 'utility_bill', 'other'] })
    documentType: string;

    @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' })
    verificationStatus: string;

    @Column({ type: 'text', nullable: true })
    rejectionReason: string | null;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    // Relations
    @ManyToOne(() => User, (user) => user.documents)
    user: User;

    @Column()
    userId: number;
}