// src/operations/operations.controller.ts
import {
    Body,
    Controller,
    Get,
    Post,
    Param,
    UseGuards,
    ParseIntPipe,
    Request,
    Put,
    Patch
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth
} from '@nestjs/swagger';
import { OperationsService } from './operations.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/user.entity';
import { Operation } from './operation.entity';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { OperationResponseDto } from './dto/operation-response.dto';
import { UpdateOperationStatusDto } from './dto/update-operation-status.dto';

@ApiTags('operations')
@Controller('operations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OperationsController {
    constructor(private readonly operationsService: OperationsService) { }

    @Post('deposit')
    @ApiOperation({ summary: 'Hisobni to\'ldirish zaявкаsi yaratish' })
    @ApiResponse({ status: 201, description: 'Zaявка yaratildi', type: Operation })
    async createDeposit(
        @GetUser() user: User,
        @Body() createDepositDto: CreateDepositDto
    ) {
        return this.operationsService.createDeposit(user.id, createDepositDto);
    }

    @Post('withdrawal')
    @ApiOperation({ summary: 'Pul yechish zaявкаsi yaratish' })
    @ApiResponse({ status: 201, description: 'Zaявка yaratildi', type: Operation })
    async createWithdrawal(
        @GetUser() user: User,
        @Body() createWithdrawalDto: CreateWithdrawalDto
    ) {
        return this.operationsService.createWithdrawal(user.id, createWithdrawalDto);
    }

    @Get()
    @ApiOperation({ summary: 'Mening operatsiyalarim tarixi' })
    @ApiResponse({ status: 200, description: 'Operatsiyalar ro\'yxati', type: [OperationResponseDto] })
    async getUserOperations() {
        return this.operationsService.getUserOperations();
    }


    @Get('stats')
    @ApiOperation({ summary: 'Mening operatsiyalar statistikasi' })
    @ApiResponse({ status: 200, description: 'Operatsiyalar statistikasi' })
    async getUserOperationStats(@GetUser() user: User) {
        return this.operationsService.getUserOperationStats(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Operatsiya tafsilotlari' })
    @ApiResponse({ status: 200, description: 'Operatsiya ma\'lumotlari', type: Operation })
    async getOperationById(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.operationsService.getOperationById(id, user.id);
    }

    @Patch(':id/status')
    async updateStatus(
      @Param('id', ParseIntPipe) operationId: number,
      @Body() dto: UpdateOperationStatusDto,
    ): Promise<Operation> {
      return this.operationsService.updateOperationStatus(operationId, dto);
    }
}