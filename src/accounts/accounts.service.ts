import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountResponseDto } from './dto/account-response.dto';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private readonly accountsRepository: Repository<Account>,
    ) {}

    async createAccount(userId: number, createAccountDto: CreateAccountDto): Promise<Account> {
        // Генерация номера счета
        const accountNumber = this.generateAccountNumber();
        
        const account = this.accountsRepository.create({
            ...createAccountDto,
            userId,
            accountNumber,
        });
        
        return this.accountsRepository.save(account);
    }

    async getUserAccounts(userId: number): Promise<AccountResponseDto[]> {
        const accounts = await this.accountsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    
        return accounts.map(account => ({
            id: account.id.toString(),
            accountNumber: account.accountNumber,
            currency: account.currency,
            balance: Number(account.balance),
            income: Number(account.profit),
            profitPercent: Number(account.profitPercentage)
        }));
    }

    async getAccountById(id: number, userId: number): Promise<AccountResponseDto> {
        const account = await this.accountsRepository.findOne({
            where: { id, userId },
            // relations: ['operations', 'user'] - olib tashlang
        });
        
        if (!account) {
            throw new NotFoundException('Счет не найден');
        }
        
        return {
            id: account.id.toString(),
            accountNumber: account.accountNumber,
            currency: account.currency,
            balance: Number(account.balance),
            income: Number(account.profit),
            profitPercent: Number(account.profitPercentage)
        };
    }

    async updateAccountBalance(accountId: number, amount: number): Promise<Account> {
        const account = await this.accountsRepository.findOne({ where: { id: accountId } });
        if (!account) {
            throw new NotFoundException('Счет не найден');
        }

        account.balance = Number(account.balance) + Number(amount);
        return this.accountsRepository.save(account);
    }

    async updateAccountProfit(accountId: number, profit: number, profitPercentage: number): Promise<Account> {
        const account = await this.accountsRepository.findOne({ where: { id: accountId } });
        if (!account) {
            throw new NotFoundException('Счет не найден');
        }

        account.profit = profit;
        account.profitPercentage = profitPercentage;
        return this.accountsRepository.save(account);
    }

    private generateAccountNumber(): string {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `PAMM${timestamp.slice(-6)}${random}`;
    }
}
