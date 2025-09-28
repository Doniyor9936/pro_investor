import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private resend: Resend;
  private useResend: boolean = false;

  constructor(private configService: ConfigService) {
    // SMTP sozlash
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com', 
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
      connectionTimeout: 10000, // qisqaroq timeout
      greetingTimeout: 10000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false
      }
    });

    // Resend sozlash
    const resendKey = this.configService.get<string>('RESEND_API_KEY');
    if (resendKey) {
      this.resend = new Resend(resendKey);
    }

    // Connection test
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection muvaffaqiyatli!');
      this.useResend = false;
    } catch (error) {
      console.error('❌ SMTP connection xatosi:', error.message);
      console.log('🔄 Resend ga o\'tilmoqda...');
      this.useResend = true;
    }
  }

  async sendMail(to: string, subject: string, text: string) {
    // Avval SMTP bilan urinib ko'ramiz
    if (!this.useResend) {
      try {
        console.log(`📧 SMTP orqali email yuborilmoqda: ${to}`);
        
        const result = await Promise.race([
          this.transporter.sendMail({
            from: `"Pro Investor" <${this.configService.get<string>('SMTP_USER')}>`,
            to,
            subject,
            text,
            html: `<p>${text}</p>`
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('SMTP timeout')), 15000)
          )
        ]);
        
        console.log('✅ SMTP orqali email yuborildi:', result.messageId);
        return result;
      } catch (error) {
        console.error('❌ SMTP xatosi:', error.message);
        console.log('🔄 Resend ga o\'tilmoqda...');
        this.useResend = true;
      }
    }

    // Resend bilan yuborish
    if (this.useResend && this.resend) {
      try {
        console.log(`📧 Resend orqali email yuborilmoqda: ${to}`);
        
        const { data, error } = await this.resend.emails.send({
          from: 'Pro Investor <onboarding@resend.dev>',
          to: [to],
          subject,
          text,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Pro Investor</h2>
              <p style="color: #666; line-height: 1.6;">${text}</p>
            </div>
          `,
        });

        if (error) {
          throw new Error(`Resend xatosi: ${error.message}`);
        }

        console.log('✅ Resend orqali email yuborildi:', data.id);
        return data;
      } catch (error) {
        console.error('❌ Resend xatosi:', error.message);
        throw error;
      }
    }

    throw new Error('Hech qanday email service ishlamadi');
  }
}