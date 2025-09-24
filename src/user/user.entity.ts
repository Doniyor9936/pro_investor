import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from 'src/accounts/account.entity';
import { Operation } from 'src/operations/operation.entity';
import { Document } from '../documents/document.entity';

@Entity('users')
export class User {
    @ApiProperty({ example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'user@example.com' })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ example: 'StrongPass123' })
    @Column()
    password: string;

    @ApiProperty({ example: 'John Doe' })
    @Column()
    fullName: string;

    @Column({ type: 'varchar', length: 6, nullable: true })
    emailCode: string | null;

    @Column({ type: 'timestamp', nullable: true })
  emailCodeExpiresAt?: Date | null; // Kodning amal qilish muddati


    @Column({ default: false })   // 👈 verify flag
    isEmailVerified: boolean;

    @Column({ type: 'varchar', length: 15, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 120, nullable: true })
    passport: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    issuedBy: string;

    @Column({ type: 'date', nullable: true })
    issuedDate: Date;

    @Column({ type: 'varchar', length: 20, nullable: true })
    code: string;

    @Column({ type: 'enum', enum: ['М', 'Ж'], nullable: true })
    gender: string;

    @Column({ type: 'date', nullable: true })
    birthDate: Date;

    // user.entity.ts
    @Column({ type: 'enum', enum: ['investor', 'admin'], default: 'investor' })
    role: string;

    @OneToMany(() => Account, (account) => account.user)
    accounts: Account[];

    @OneToMany(() => Operation, (operation) => operation.user)
    operations: Operation[];

    @OneToMany(() => Document, (document) => document.user)
    documents: Document[];

    @ApiProperty({ example: '2025-09-18T12:00:00Z' })
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ApiProperty({ example: '2025-09-18T12:00:00Z' })
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}

