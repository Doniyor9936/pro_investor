import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDepositDto {
  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'Savdo uchun hisobni to‘ldirish' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ example: 'WhatsApp: +998901234567' })
  @IsOptional()
  @IsString()
  contactMethod?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  accountId?: number;
}
