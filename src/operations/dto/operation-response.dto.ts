// src/operations/dto/operation-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Operation } from '../operation.entity';

export class OperationResponseDto {
    @ApiProperty({ example: 'op1' })
    id: string;

    @ApiProperty({ example: '2025-09-21' })
    date: string;

    @ApiProperty({ example: 'deposit', enum: ['deposit', 'withdraw', 'profit'] })
    type: string;

    @ApiProperty({ example: '1234567890' })
    account: string;

    @ApiProperty({ example: 10000 })
    amount: number;

    @ApiProperty({ example: 'completed', enum: ['pending', 'completed', 'failed', 'cancelled'] })
    status: string;

    static fromEntity(entity: Operation): OperationResponseDto {
        const dto = new OperationResponseDto();
        dto.id = `op${entity.id}`;
        dto.date = entity.createdAt.toISOString().split('T')[0]; // faqat YYYY-MM-DD
        dto.type = entity.type === 'withdrawal' ? 'withdraw' : entity.type; // withdrawal -> withdraw
        dto.account = entity.account?entity.account.number : '';// account jadvalidan raqam olish
        dto.amount = entity.type === 'withdrawal' ? -Number(entity.amount) : Number(entity.amount);
        return dto;
    }
}
