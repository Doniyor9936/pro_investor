import { Body, Controller, Get, Put, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OperationsService } from '../operations/operations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('admin-operations')
@Controller('admin/operations')
@UseGuards(JwtAuthGuard) // TODO: AdminGuard qo'shish
@ApiBearerAuth()
export class AdminOperationsController {
    constructor(private readonly operationsService: OperationsService) {}

    @Get()
    @ApiOperation({ summary: 'Barcha operatsiyalar (Admin)' })
    async getAllOperations(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
        @Query('type') type?: string,
        @Query('status') status?: string
    ) {
        return this.operationsService.getAllOperations(page, limit, type, status);
    }

    @Put(':id/status')
    @ApiOperation({ summary: 'Operatsiya statusini yangilash (Admin)' })
    async updateOperationStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: string,
        @Body('adminComment') adminComment?: string
    ) {
        return this.operationsService.updateOperationStatus(id, status, adminComment);
    }
}