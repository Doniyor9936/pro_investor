import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  managementFee?: number;
}