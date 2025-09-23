// src/accounts/dto/account-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AccountResponseDto {
    @ApiProperty({ example: '1' })
    id: string;

    @ApiProperty({ example: '1234567890' })
    accountNumber: string;

    @ApiProperty({ example: 'RUB' })
    currency: string;

    @ApiProperty({ example: 25000 })
    balance: number;

    @ApiProperty({example:'Kapital Bank'})
    bankName: string;

    @ApiProperty({ example: 3500 })
    income: number;

    @ApiProperty({ example: 14 })
    profitPercent: number;
}

