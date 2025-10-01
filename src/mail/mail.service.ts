import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MailService {
  private resendApiKey: string;

  constructor(private configService: ConfigService) {
    // configdan string qaytadi
    this.resendApiKey = this.configService.get<string>('RESEND_API_KEY') ?? '';
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      const response = await axios.post(
        'https://api.resend.com/emails',
        {
          from: 'Pro Investor <info@pro.com>', // Resend’da verify qilingan email bo‘lishi kerak
          to,
          subject,
          text,
          html: `<p>${text}</p>`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.resendApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('✅ Email yuborildi:', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ Email yuborishda xato:', error.response?.data || error.message);
      throw error;
    }
  }
}
