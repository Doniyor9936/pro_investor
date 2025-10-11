import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('POSTGRES_URL'),
        // host: config.get<string>('DB_HOST'),
        // port: config.get<number>('DB_PORT'),
        // username: config.get<string>('DB_USERNAME'),
        // password: config.get<string>('DB_PASSWORD'),
        // database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true, // development uchun
        ssl:config.get<string>('NODE_ENV') === 'production'?{rejectUnauthorized:false}:false
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
