import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from './operation.entity';
import { UsersModule } from 'src/user/user.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { AdminOperationsController } from './admin-operations.controller';
import { MailService } from 'src/mail/mail.service';
import { Account } from 'src/accounts/account.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:[TypeOrmModule.forFeature([Operation,Account]),NotificationsModule,UsersModule,MailModule],
  controllers: [OperationsController,AdminOperationsController],
  providers: [OperationsService,MailService],
})
export class OperationsModule {}
