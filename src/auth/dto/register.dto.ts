import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'user@example.com', 
    description: 'Foydalanuvchi emaili', 
    uniqueItems: true 
  })
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

  @ApiProperty({ 
    example: 'investor', 
    description: 'Foydalanuvchi roli', 
    default: 'investor' 
  })
  @IsOptional()      // optional qilindi
  @IsString()
  role?: string;

  @ApiProperty({  
    description: 'Jinsi',
  })
  @IsOptional()      // optional qilindi
  @IsString()
  gender?: string;
}
