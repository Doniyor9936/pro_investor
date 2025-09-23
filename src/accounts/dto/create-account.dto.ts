import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateAccountDto {
  @ApiProperty({ example: 'RUB' })
  @IsString()
  currency: string;

  @ApiProperty({ example: '044525225' })
  @IsString()
  bikOrBank: string;

  @ApiProperty({ example: '12345678901234567890' })
  @IsString()
  accountNumber: string;

  @ApiProperty({ example: 'Сбербанк' })
  @IsString()
  bankName: string;

  @ApiProperty({ example: '7707083893' })
  @IsString()
  inn: string;

  @ApiProperty({ example: '773601001' })
  @IsString()
  kpp: string;

  @ApiProperty({ example: '30101810400000000225' })
  @IsString()
  corrAccount: string;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  balance: number;
}