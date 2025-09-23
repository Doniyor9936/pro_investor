import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmailCodeDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  emailCode: string;
}
