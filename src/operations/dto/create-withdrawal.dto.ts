import { IsNumber, IsString, IsOptional, Min, IsObject, ValidateNested, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class WithdrawalDetailsDto {
  @ApiProperty({ example: 'Tinkoff Bank' })
  @IsString()
  bankName: string;

  @ApiProperty({ example: '4111111111111111' })
  @IsString()
  cardNumber: string;

  @ApiProperty({ example: 'Иван Иванов' })
  @IsString()
  recipientName: string;
}

export class CreateWithdrawalDto {
  @ApiProperty({ example: 1234567890 })
  @IsNumber()
  @Type(() => Number)
  accountId: number;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'Вывод на карту' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    type: WithdrawalDetailsDto,
    example: {
      bankName: 'Tinkoff Bank',
      cardNumber: '4111111111111111',
      recipientName: 'Иван Иванов'
    }
  })
  @IsObject()
  @ValidateNested()
  @Type(() => WithdrawalDetailsDto)
  withdrawalDetails: WithdrawalDetailsDto;

  @ApiProperty({ example: 'created', enum: ['created', 'processing', 'completed', 'rejected'] })
  @IsOptional()
  @IsEnum(['created', 'processing', 'completed', 'rejected'])
  status?: string;
}
