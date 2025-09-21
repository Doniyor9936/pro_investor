// src/documents/dto/update-verification.dto.ts
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVerificationDto {
    @ApiProperty({ 
        example: 'approved', 
        enum: ['pending', 'approved', 'rejected'],
        description: 'Tasdiqlash holati'
    })
    @IsEnum(['pending', 'approved', 'rejected'], {
        message: 'Status pending, approved yoki rejected bo\'lishi kerak'
    })
    status: string;

    @ApiProperty({ 
        example: 'Hujjat aniq emas', 
        required: false,
        description: 'Rad etish sababi (faqat rejected status uchun)'
    })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Rad etish sababi 500 ta belgidan oshmasligi kerak' })
    rejectionReason?: string;
}