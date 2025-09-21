// src/operations/operations.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation } from './operation.entity';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../user/user.service';

@Injectable()
export class OperationsService {
    constructor(
        @InjectRepository(Operation)
        private readonly operationsRepository: Repository<Operation>,
        private readonly notificationsService: NotificationsService,
        private readonly usersService: UsersService,
    ) {}

    // Pul qo'shish zaявкаsi (TZ: формы‑заявки с отправкой на e‑mailадминистратора)
    async createDeposit(userId: number, createDepositDto: CreateDepositDto): Promise<Operation> {
        const operation = this.operationsRepository.create({
            type: 'deposit',
            userId,
            amount: createDepositDto.amount,
            comment: createDepositDto.comment,
            contactMethod: createDepositDto.contactMethod,
            accountId: createDepositDto.accountId,
            status: 'created',
        });

        const savedOperation = await this.operationsRepository.save(operation);

        // User'ga email yuborish (TZ: уведомления на e‑mail при создании заявки)
        const user = await this.usersService.findById(userId);
        await this.notificationsService.sendNotification(
            userId,
            user.email,
            'Заявка на пополнение создана',
            `Ваша заявка на пополнение счета на сумму ${createDepositDto.amount} RUB создана. Администратор свяжется с вами для выставления счета.`
        );

        return savedOperation;
    }

    // Pul yechish zaявкаsi (TZ: формы‑заявки с отправкой на e‑mailадминистратора)
    async createWithdrawal(userId: number, createWithdrawalDto: CreateWithdrawalDto): Promise<Operation> {
        const operation = this.operationsRepository.create({
            type: 'withdrawal',
            userId,
            amount: createWithdrawalDto.amount,
            comment: createWithdrawalDto.comment,
            withdrawalDetails: createWithdrawalDto.withdrawalDetails,
            accountId: createWithdrawalDto.accountId,
            status: 'created',
        });

        const savedOperation = await this.operationsRepository.save(operation);

        // User'ga email yuborish
        const user = await this.usersService.findById(userId);
        const withdrawalInfo = createWithdrawalDto.withdrawalDetails;
        await this.notificationsService.sendNotification(
            userId,
            user.email,
            'Заявка на вывод средств создана',
            `Ваша заявка на вывод ${createWithdrawalDto.amount} RUB создана. Реквизиты: ${withdrawalInfo.bankName}, ${withdrawalInfo.cardNumber}.`
        );

        return savedOperation;
    }

    // User operatsiyalari (TZ: таблица заявок/операций)
    async getUserOperations(
        userId: number,
        page: number = 1,
        limit: number = 20,
        type?: string,
        status?: string
    ) {
        const whereConditions: any = { userId };
        
        if (type) whereConditions.type = type;
        if (status) whereConditions.status = status;

        const [operations, total] = await this.operationsRepository.findAndCount({
            where: whereConditions,
            relations: ['account'],
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

    // Bitta operatsiya
    async getOperationById(operationId: number, userId: number): Promise<Operation> {
        const operation = await this.operationsRepository.findOne({
            where: { id: operationId, userId },
            relations: ['user', 'account'],
        });

        if (!operation) {
            throw new NotFoundException('Operatsiya topilmadi');
        }

        return operation;
    }

    // Admin: Status yangilash (TZ: статусы заявок обновляются вручную)
    async updateOperationStatus(
        operationId: number,
        status: string,
        adminComment?: string
    ): Promise<Operation> {
        const operation = await this.operationsRepository.findOne({
            where: { id: operationId },
            relations: ['user'],
        });

        if (!operation) {
            throw new NotFoundException('Operatsiya topilmadi');
        }

        const allowedStatuses = ['created', 'processing', 'completed', 'rejected'];
        if (!allowedStatuses.includes(status)) {
            throw new BadRequestException('Noto\'g\'ri status');
        }

        const oldStatus = operation.status;
        operation.status = status;
        if (adminComment) {
            operation.adminComment = adminComment;
        }

        const updatedOperation = await this.operationsRepository.save(operation);

        // Status o'zgarganda email yuborish (TZ: смене статуса заявки)
        if (oldStatus !== status) {
            const statusMap = {
                created: 'создана',
                processing: 'в обработке',
                completed: 'выполнена',
                rejected: 'отклонена'
            };

            const operationTypeRu = operation.type === 'deposit' ? 'пополнения' : 'вывода средств';
            
            await this.notificationsService.sendNotification(
                operation.user.id,
                operation.user.email,
                `Статус заявки изменен: ${statusMap[status]}`,
                `Статус вашей заявки на ${operationTypeRu} изменился с "${statusMap[oldStatus]}" на "${statusMap[status]}". ${adminComment ? `Комментарий: ${adminComment}` : ''}`
            );
        }

        return updatedOperation;
    }

    // Admin: Barcha operatsiyalar
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

    // User operatsiyalar statistikasi
    async getUserOperationStats(userId: number) {
        const operations = await this.operationsRepository.find({ where: { userId } });
        
        const stats = {
            total: operations.length,
            deposits: operations.filter(op => op.type === 'deposit').length,
            withdrawals: operations.filter(op => op.type === 'withdrawal').length,
            completed: operations.filter(op => op.status === 'completed').length,
            pending: operations.filter(op => ['created', 'processing'].includes(op.status)).length,
            rejected: operations.filter(op => op.status === 'rejected').length,
            totalAmount: operations
                .filter(op => op.status === 'completed')
                .reduce((sum, op) => sum + Number(op.amount), 0)
        };

        return stats;
    }
}