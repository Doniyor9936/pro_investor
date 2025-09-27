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
import { ConfigService } from '@nestjs/config';
import { Account } from 'src/accounts/account.entity';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private readonly operationsRepository: Repository<Operation>,
    @InjectRepository(Account)
    private readonly accoutRepository: Repository<Account>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) { }

  private generateEmailCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createDeposit(userId: number, createDepositDto: CreateDepositDto): Promise<Operation> {
    const emailCode = this.generateEmailCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const account = await this.accoutRepository.findOne({ where: { id: createDepositDto.accountId, userId } });

    if (!account) {
      throw new NotFoundException('Account not found');
    }
    const operation = this.operationsRepository.create({
      ...createDepositDto,
      userId,
      accountId: createDepositDto.accountId,
      type: 'deposit',
      status: createDepositDto.status ?? 'create',
      emailCode,
      emailCodeExpiresAt: expiresAt,
    });
    // Balansni yangilash
    account.balance = +account.balance + +createDepositDto.amount;

    // Transaction ishlatgan yaxshi (ikkalasini birdan saqlash uchun)
    await this.accoutRepository.save(account);
    await this.operationsRepository.save(operation);

    const adminEmail = this.configService.get<string>('admin_email');
    if (!adminEmail) {
      console.error('ADMIN_EMAIL .env da topilmadi!');
    } else {
      this.mailService
        .sendMail(
          adminEmail,
          'Yangi operatsiya',
          `Foydalanuvchi ID: ${userId} tomonidan ${operation.type} operatsiyasi yaratildi.
     Miqdor: ${operation.amount}, Account: ${operation.accountId}, Status: ${operation.status}`,
        )
        .then(() => console.log('Admin emailiga yuborildi'))
        .catch((err) => console.error('Email yuborishda xato:', err));
    }

    return operation;
  }

  async createWithdrawal(userId: number, createWithdrawalDto: CreateWithdrawalDto): Promise<Operation> {
    const emailCode = this.generateEmailCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const account = await this.accoutRepository.findOne({ where: { id: createWithdrawalDto.accountId, userId } })
    if (!account) {
      throw new NotFoundException("account not found");

    }
    account.balance = account.balance - createWithdrawalDto.amount

    const operation = this.operationsRepository.create({
      type: 'withdrawal',
      userId,
      amount: createWithdrawalDto.amount,
      comment: createWithdrawalDto.comment,
      accountId: createWithdrawalDto.accountId,
      withdrawalDetails: createWithdrawalDto.withdrawalDetails,
      status: 'created',
      emailCode,
      emailCodeExpiresAt: expiresAt,
    });

    await this.accoutRepository.save(account);
    await this.operationsRepository.save(operation)

    const adminEmail = this.configService.get<string>('admin_email');
    if (!adminEmail) {
      console.error('ADMIN_EMAIL .env da topilmadi!');
    } else {
      this.mailService
        .sendMail(
          adminEmail,
          'Yangi operatsiya',
          `Foydalanuvchi ID: ${userId} tomonidan ${operation.type} operatsiyasi yaratildi.
     Miqdor: ${operation.amount}, Account: ${operation.accountId}, Status: ${operation.status}`,
        )
        .then(() => console.log('Admin emailiga yuborildi'))
        .catch((err) => console.error('Email yuborishda xato:', err));
    }
    return operation;
  }

  // src/operations/operations.service.ts
  async getUserOperations(): Promise<OperationResponseDto[]> {
    const operations = await this.operationsRepository.find({
      relations: ['account', 'user'],
      order: { createdAt: 'DESC' },
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
    const operations = await this.operationsRepository.find({
      where: { userId },
    });

    return {
      total: operations.length,
      deposits: operations.filter((op) => op.type === 'deposit').length,
      withdrawals: operations.filter((op) => op.type === 'withdrawal').length,
      completed: operations.filter((op) => op.status === 'completed').length,
      pending: operations.filter((op) => ['created', 'processing'].includes(op.status)).length,
      rejected: operations.filter((op) => op.status === 'rejected').length,
    };
  }

  // src/operations/operations.service.ts da qo'shing
  async getAllOperations(page: number = 1, limit: number = 20, type?: string, status?: string) {
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

  async updateOperationStatus(operationId, dto: UpdateOperationStatusDto): Promise<Operation> {
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
