import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com', 
      port: 587,
      secure: false, // TLS uchun
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
      // Timeout sozlamalari
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 75000,
      // Gmail uchun qo'shimcha sozlamalar
      tls: {
        rejectUnauthorized: false
      }
    });

    // Connection testini qo'shamiz
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection muvaffaqiyatli!');
    } catch (error) {
      console.error('❌ SMTP connection xatosi:', error.message);
    }
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      console.log(`📧 Email yuborilmoqda: ${to}`);
      
      const result = await this.transporter.sendMail({
        from: `"Pro Investor" <${this.configService.get<string>('SMTP_USER')}>`,
        to,
        subject,
        text,
        html: `<p>${text}</p>` // HTML formatini ham qo'shamiz
      });
      
      console.log('✅ Email muvaffaqiyatli yuborildi:', result.messageId);
      return result;
    } catch (err) {
      console.error('❌ Email yuborishda xato:', err);
      throw new Error(`Email yuborib bo'lmadi: ${err.message}`);
    }
  }
}