import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

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
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.findById(id); // mavjudligini tekshirish
    Object.assign(user, data);
    return this.usersRepository.save(user);
  }

  // Foydalanuvchi o‘chirish (agar kerak bo‘lsa)
  async removeUser(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }
}
