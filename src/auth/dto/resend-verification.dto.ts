// src/auth/dto/resend-verification.dto.ts
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class ResendVerificationDto {
  @IsEmail()
  email: string;
}
