import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: Number(this.configService.get('SMTP_PORT')),
      secure: true, // 465 bo‘lsa true
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
    
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      const result = await this.transporter.sendMail({
        from: `"Pro Investor" <${this.configService.get<string>('SMTP_USER')}>`, // Gmailingizdan ketadi
        to,
        subject,
        text,
        html: `<p>${text}</p>`,
      });

      console.log('✅ Email yuborildi:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Email yuborishda xato:', error.message);
      throw error;
    }
  }
}
