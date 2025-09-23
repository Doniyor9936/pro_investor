// dto/update-operation-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateOperationStatusDto {
  @ApiProperty({ 
    description: 'Operatsiya statusi',
    example: 'approved' 
  })
  @IsString()
  status: string;

  @ApiProperty({ 
    description: 'Admin izohi',
    example: 'Operatsiya tasdiqlandi',
    required: false 
  })
  @IsOptional()
  @IsString()
  adminComment?: string;
}