import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // User entity bilan TypeORM integratsiyasi
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // boshqa modullar (masalan AuthModule) uchun foydalanish
})
export class UsersModule {}
