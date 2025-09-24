import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'oldPass123' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'newPass456' })
  @IsString()
  @MinLength(6, { message: 'Parol kamida 6 belgidan iborat bo‘lishi kerak' })
  newPassword: string;
}
