import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: '2025-09-18T12:00:00Z' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2025-09-18T12:00:00Z' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
