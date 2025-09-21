// src/notifications/notifications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationsRepository: Repository<Notification>,
        private readonly mailService: MailService,
    ) {}

    // Email jo'natish va saqlash
    async sendNotification(
        userId: number | null,
        userEmail: string,
        subject: string,
        message: string
    ): Promise<Notification> {
        // Notification yaratish
        const notification = this.notificationsRepository.create({
            userId,
            subject,
            message,
            type: 'email',
        });

        const savedNotification = await this.notificationsRepository.save(notification);

        // Email jo'natish
        try {
            await this.mailService.sendMail(userEmail, subject, message);
            
            savedNotification.isSent = true;
            savedNotification.sentAt = new Date();
        } catch (error) {
            savedNotification.errorMessage = error.message;
        }

        return this.notificationsRepository.save(savedNotification);
    }

    // User notifications
    async getUserNotifications(userId: number): Promise<Notification[]> {
        return this.notificationsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    // Notification topish
async getNotificationById(id: number): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({ where: { id } });
    
    if (!notification) {
        throw new NotFoundException('Notification topilmadi');
    }
    
    return notification;
}
}

