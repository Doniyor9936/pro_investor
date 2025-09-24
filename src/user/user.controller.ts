import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UsersService } from './user.service';
import { UpdatePasswordDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth() // JWT token kerakligini bildiradi
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // JWT guard bilan hozirgi foydalanuvchi profilini olish
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Hozirgi foydalanuvchi profili' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    return {
      fullName: user.fullName,
      phone: user.phone ?? null,
      email: user.email,
      passport: user.passport ?? null,
      issuedBy: user.issuedBy ?? null,
      issuedDate: user.issuedDate ?? null,
      code: user.code ?? null,
      gender: user.gender ?? null,
      birthDate: user.birthDate ?? null,
    };
  }

  // JWT guard bilan hozirgi foydalanuvchi profilini yangilash
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiOperation({ summary: 'Hozirgi foydalanuvchi profilini yangilash' })
  async updateProfile(@Request() req, @Body() body: UpdatePasswordDto) {
     await this.usersService.updateUserPassword(req.user.userId,body);
    return {
      message: 'user muaffaqiyatli yangilandi'
    };
  }

  // Boshqa foydalanuvchini ID bo‘yicha olish (admin uchun)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Foydalanuvchi ID bo‘yicha' })
  @ApiParam({ name: 'id', type: Number })
  async getUserById(@Param('id') id: number) {
    const user = await this.usersService.findById(id);
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
    };
  }
}
