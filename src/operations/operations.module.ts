import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from './operation.entity';
import { Notification } from 'src/notifications/notification.entity';
import { UsersModule } from 'src/user/user.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { AdminOperationsController } from './admin-operations.controller';

@Module({
  imports:[TypeOrmModule.forFeature([Operation]),NotificationsModule,UsersModule],
  controllers: [OperationsController,AdminOperationsController],
  providers: [OperationsService],
})
export class OperationsModule {}
