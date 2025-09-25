import { IsNumber, IsString, IsOptional, Min, IsEnum, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDepositDto {
  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'Savdo uchun hisobni to\'ldirish' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ example: '8600123456789012', description: 'Karta raqami (16 xonali)' })
  @IsOptional()
  @IsString()
  @Length(16, 16, { message: 'Karta raqami 16 xonali bo‘lishi kerak' })
  @Matches(/^[0-9]+$/, { message: 'Karta raqami faqat raqamlardan iborat bo‘lishi kerak' })
  cardNumber?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  accountId?: number;

  @ApiProperty({ example: 'created', enum: ['created', 'processing', 'completed', 'rejected'] })
  @IsOptional()
  @IsEnum(['created', 'processing', 'completed', 'rejected'])
  status?: string;
}
