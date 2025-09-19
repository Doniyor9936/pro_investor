import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Foydalanuvchi emaili' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123', description: 'Parol' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Foydalanuvchi to‘liq ismi' })
  @IsString()
  @IsNotEmpty()
  fullName: string;
}
