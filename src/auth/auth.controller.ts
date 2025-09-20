import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { VerifyEmailDto } from './dto/verfy.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Ro‘yxatdan o‘tish' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Foydalanuvchi profili (JWT bilan himoyalangan)' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('verify-user')
  @ApiOperation({ summary: 'foydalanuvchini tasdiqlash' })
  verify(@Body() verifyDto: VerifyEmailDto) {
    return this.authService.verifyByEmail(verifyDto)
  }
}
