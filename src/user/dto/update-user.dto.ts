// src/user/dto/update-user.dto.ts
import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Bu import qo'shilmagan bo'lishi mumkin

export class UpdateUserDto {
    @ApiProperty({ required: false, example: 'John Doe' })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiProperty({ required: false, example: '+998901234567' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ required: false, example: 'AB1234567' })
    @IsOptional()
    @IsString()
    passport?: string;

    @ApiProperty({ required: false, })
    @IsOptional()
    @IsString()
    code?: string;

    @ApiProperty({ required: false, example: 'Toshkent IIB' })
    @IsOptional()
    @IsString()
    issuedBy?: string;

    @ApiProperty({ required: false, example: '2020-05-15' })
    @IsOptional()
    @IsDateString()
    issuedDate?: string;

    @ApiProperty({ required: false,})
    @IsOptional()
    @IsString()
    gender?: string;

    @ApiProperty({ required: false, })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({ required: false, example: '1990-01-01' })
    @IsOptional()
    @IsDateString()
    birthDate?: string;

}