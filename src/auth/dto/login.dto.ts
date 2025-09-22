import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'doniyorqalandarov853@gmail.com', description: 'Foydalanuvchi emaili' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123', description: 'Parol' })
  @IsString()
  @MinLength(6)
  password: string;
}
