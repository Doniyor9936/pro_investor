import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('POSTGRES'),
        // host: config.get<string>('DB_HOST'),
        // port: config.get<number>('DB_PORT'),
        // username: config.get<string>('DB_USERNAME'),
        // password: config.get<string>('DB_PASSWORD'),
        // database: config.get<string>('DB_NAME'),
        entities: [User],
        ssl: {
          rejectUnauthorized: false, // 🔑 Render SSL talab qiladi
        },
        synchronize: true, // development uchun
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
