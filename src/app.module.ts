import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { OperationsModule } from './operations/operations.module';
import { DocumentsModule } from './documents/documents.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),AuthModule, UsersModule, AccountsModule, OperationsModule, DocumentsModule, NotificationsModule,DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
