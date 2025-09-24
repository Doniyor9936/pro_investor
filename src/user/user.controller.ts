import { Controller, Get, Patch, Body, Param, UseGuards, Request, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UsersService } from './user.service';
import { UpdatePasswordDto } from './dto/update-password-user.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

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
      role: user.role
    };
  }

  // JWT guard bilan hozirgi foydalanuvchi profilini yangilash
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiOperation({ summary: 'Hozirgi foydalanuvchi profilini yangilash' })
  async updateProfile(@Request() req, @Body() body: UpdatePasswordDto) {
    await this.usersService.updateUserPassword(req.user.userId, body);
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

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')  // faqat adminlar kirishi mumkin
  async updateRole(
    @Param('id') id: number,
    @Body('role') role?: string
  ) {
    const user = await this.usersService.updateUserRole(id, role);
    return { message: 'Foydalanuvchi roli yangilandi', user };
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user = await this.usersService.updateUser(id, updateUserDto);
    return { message: 'Foydalanuvchi ma’lumotlari yangilandi', user };
  }

}
