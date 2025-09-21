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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './account.entity';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // agar JWT ishlatayotgan bo‘lsang

@ApiTags('Accounts')
@Controller('accounts')
// @UseGuards(JwtAuthGuard) // agar autentifikatsiya kerak bo‘lsa qo‘shasan
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi hisob ochish' })
  @ApiResponse({ status: 201, type: Account })
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
    @Req() req: any, // JWT dan foydalanuvchi ID olish
  ): Promise<Account> {
    const userId = req.user?.id; // JWT payload ichidan
    return this.accountsService.createAccount(userId, createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Foydalanuvchining barcha hisoblarini olish' })
  @ApiResponse({ status: 200, type: [Account] })
  async getUserAccounts(@Req() req: any): Promise<Account[]> {
    const userId = req.user?.id;
    return this.accountsService.getUserAccounts(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Hisob ID bo‘yicha olish' })
  @ApiResponse({ status: 200, type: Account })
  async getAccountById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<Account> {
    const userId = req.user?.id;
    return this.accountsService.getAccountById(id, userId);
  }
}
