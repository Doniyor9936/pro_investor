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
      port: 465,
      secure: true, // 465 -> true, 587 -> false
      auth: {
        user: this.configService.get<string>('SMTP_USER'), // sizning Gmail
        pass: this.configService.get<string>('SMTP_PASS'), // App password
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
