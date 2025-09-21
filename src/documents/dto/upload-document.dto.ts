import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentDto {
    @ApiProperty({ 
        example: 'passport', 
        enum: ['passport', 'selfie', 'utility_bill', 'other'],
        description: 'Hujjat turi'
    })
    @IsEnum(['passport', 'selfie', 'utility_bill', 'other'], {
        message: 'Hujjat turi passport, selfie, utility_bill yoki other bo\'lishi kerak'
    })
    documentType: string;
}

