// src/user/dto/update-user.dto.ts
import { IsOptional, IsString, IsDate } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    passport?: string;

    @IsOptional()
    @IsString()
    issuedBy?: string;

    @IsOptional()
    @IsDate()
    issuedDate?: Date;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsDate()
    birthDate?: Date;

    @IsOptional()
    @IsString()
    role?: string; // admin faqat shu maydonni yangilashi mumkin
}
