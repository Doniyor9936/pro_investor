import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdatePasswordDto } from './dto/update-password-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  // ID bo‘yicha foydalanuvchini topish
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Foydalanuvchi topilmadi: ${id}`);
    }
    return user;
  }

  // Email bo‘yicha foydalanuvchini topish
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // Yangi foydalanuvchi yaratish
  async createUser(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  // Foydalanuvchi ma’lumotlarini yangilash
  async updateUserPassword(id: number, data: UpdatePasswordDto): Promise<User> {
    const user = await this.findById(id); // mavjudligini tekshirish
    if (data.newPassword) {
      user.password = await bcrypt.hash(data.newPassword, 8)
    }
    return this.usersRepository.save(user);
  }

  async updateEmailCode(userId: number, emailCode: string | null, expiresAt: Date | null): Promise<User> {
    const user = await this.findById(userId);
    user.emailCode = emailCode;
    user.emailCodeExpiresAt = expiresAt;
    return this.usersRepository.save(user);
  }


  // Foydalanuvchi o‘chirish (agar kerak bo‘lsa)
  async removeUser(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }

  // src/user/user.service.ts
  async updateUserRole(userId: number, role?: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    if (role != undefined) {
      user.role = role;
      await this.usersRepository.save(user)
    }


    return user;
  }

  // src/user/user.service.ts
  async updateUser(userId: number, updateData: Partial<UpdateUserDto>) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    Object.assign(user, updateData);
    const updateUser = await this.usersRepository.save(user)

    return updateUser;
  }
}
