import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  ParseIntPipe, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './account.entity';
import { AccountResponseDto } from './dto/account-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // agar JWT ishlatayotgan bo‘lsang

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard) // agar autentifikatsiya kerak bo‘lsa qo‘shasan
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi hisob ochish' })
  @ApiResponse({ status: 201, type: Account })
  @ApiBearerAuth()
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
    @Req() req: any, // JWT dan foydalanuvchi ID olish
  ): Promise<Account> {
    const userId = req.user?.userId; // JWT payload ichidan
    console.log(userId);
    console.log(req);
    return this.accountsService.createAccount(userId, createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Foydalanuvchining barcha hisoblarini olish' })
  @ApiResponse({ status: 200, type: [AccountResponseDto] })
  @ApiBearerAuth()
  async getUserAccounts(@Req() req: any): Promise<AccountResponseDto[]> {
    const userId = req.user?.userId;
    return this.accountsService.getUserAccounts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Hisob ID bo‘yicha olish' })
  @ApiResponse({ status: 200, type: AccountResponseDto })
  @ApiBearerAuth()
  async getAccountById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<AccountResponseDto> {
    const userId = req.user?.userId;
    return this.accountsService.getAccountById(id, userId);
  }
}
