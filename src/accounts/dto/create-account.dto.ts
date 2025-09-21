import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ example: 'Konservativ savdo uchun PAMM-hisob' })
  @IsOptional()
  @IsString()
  description?: string;
}
