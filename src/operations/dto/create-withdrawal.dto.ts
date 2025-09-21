import { IsNumber, IsString, IsOptional, Min, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateWithdrawalDto {
  @ApiProperty({ example: 500 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'Foydani yechib olish' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    example: {
      bankName: 'Kapitalbank',
      cardNumber: '8600 1234 5678 9012',
      recipientName: 'Ali Valiyev'
    }
  })
  @IsObject()
  withdrawalDetails: {
    bankName: string;
    cardNumber: string;
    recipientName: string;
  };

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  accountId?: number;
}
