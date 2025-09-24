// src/operations/operations.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation } from './operation.entity';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { OperationResponseDto } from './dto/operation-response.dto';
import { UpdateOperationStatusDto } from './dto/update-operation-status.dto';
import { UsersService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class OperationsService {
    constructor(
        @InjectRepository(Operation)
        private readonly operationsRepository: Repository<Operation>,
        private readonly usersService: UsersService,
        private readonly mailService: MailService,
    ) { }

    private generateEmailCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async createDeposit(userId: number, createDepositDto: CreateDepositDto): Promise<Operation> {

        const emailCode = this.generateEmailCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const operation = this.operationsRepository.create({
            type: 'deposit',
            userId,
            amount: createDepositDto.amount,
            comment: createDepositDto.comment,
            accountId: createDepositDto.accountId,
            status: 'created',
            emailCode,
            emailCodeExpiresAt: expiresAt
        });

        this.usersService.findById(userId)
        .then(user => {
            return this.mailService.sendMail(
                user.email,
                'Operation Verification Code',
                `Sizning operatsiyangizni tasdiqlash kodi: ${emailCode}`
            );
        })
        .then(() => console.log('Email jo‘natildi'))
        .catch(err => console.error('Email yuborishda xato:', err));

    return operation;
    }

    async createWithdrawal(userId: number, createWithdrawalDto: CreateWithdrawalDto): Promise<Operation> {

        const emailCode = this.generateEmailCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const operation = this.operationsRepository.create({
            type: 'withdrawal',
            userId,
            amount: createWithdrawalDto.amount,
            comment: createWithdrawalDto.comment,
            accountId: createWithdrawalDto.accountId,
            withdrawalDetails: createWithdrawalDto.withdrawalDetails,
            status: 'created',
            emailCode,
            emailCodeExpiresAt: expiresAt
        });

        await this.operationsRepository.save(operation);

        this.usersService.findById(userId)
        .then(user => {
            return this.mailService.sendMail(
                user.email,
                'Operation Verification Code',
                `Sizning operatsiyangizni tasdiqlash kodi: ${emailCode}`
            );
        })
        .then(() => console.log('Email jo‘natildi'))
        .catch(err => console.error('Email yuborishda xato:', err));

    return operation;
    }

    // src/operations/operations.service.ts
    async getUserOperations(): Promise<OperationResponseDto[]> {
        const operations = await this.operationsRepository.find({
            relations: ['account','user'],
            order: { createdAt: 'DESC' }
        });

        return operations.map(OperationResponseDto.fromEntity);
    }


    async getOperationById(operationId: number, userId: number): Promise<Operation> {
        const operation = await this.operationsRepository.findOne({
            where: { id: operationId, userId },
            relations: ['account'],
        });

        if (!operation) {
            throw new NotFoundException('Operatsiya topilmadi');
        }

        return operation;
    }

    async getUserOperationStats(userId: number) {
        const operations = await this.operationsRepository.find({ where: { userId } });

        return {
            total: operations.length,
            deposits: operations.filter(op => op.type === 'deposit').length,
            withdrawals: operations.filter(op => op.type === 'withdrawal').length,
            completed: operations.filter(op => op.status === 'completed').length,
            pending: operations.filter(op => ['created', 'processing'].includes(op.status)).length,
            rejected: operations.filter(op => op.status === 'rejected').length,
        };
    }

    // src/operations/operations.service.ts da qo'shing
    async getAllOperations(
        page: number = 1,
        limit: number = 20,
        type?: string,
        status?: string
    ) {
        const whereConditions: any = {};

        if (type) whereConditions.type = type;
        if (status) whereConditions.status = status;

        const [operations, total] = await this.operationsRepository.findAndCount({
            where: whereConditions,
            relations: ['user', 'account'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            operations,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateOperationStatus(operationId,
        dto: UpdateOperationStatusDto
    ): Promise<Operation> {
        const operation = await this.operationsRepository.findOne({
            where: { id: operationId },
            relations: ['user'],
        });

        if (!operation) {
            throw new NotFoundException('Operatsiya topilmadi');
        }

        const allowedStatuses = ['created', 'processing', 'completed', 'rejected'];
        if (!allowedStatuses.includes(dto.status)) {
            throw new BadRequestException('Notogri status');
        }

        operation.status = dto.status;
        // adminComment field yo'q entity'da, kerak bo'lsa qo'shing

        return this.operationsRepository.save(operation);
    }
}