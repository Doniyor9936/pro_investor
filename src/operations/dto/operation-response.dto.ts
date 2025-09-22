// src/operations/dto/operation-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

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
}