import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { VerifyEmailDto } from './dto/verfy.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private mailService: MailService,
    ) { }

    async register(registerDto: RegisterDto) {
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 xonali kod
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 daqiqa
    
        const existsUser = await this.usersService.findByEmail(registerDto.email);
        if (existsUser) {
            throw new ConflictException("Foydalanuvchi allaqachon mavjud");
        }
    
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.usersService.createUser({
            ...registerDto,
            password: hashedPassword,
            emailCode: code,
            emailCodeExpiresAt: expiresAt,
        });
        console.log(code);
        
    
        try {
            await this.mailService.sendMail(
                user.email,
                'Ro‘yxatdan o‘tish kodi',
                `Sizning ro‘yxatdan o‘tish kodingiz: ${code}. Kod 5 daqiqa ichida amal qiladi.`
            );
            console.log('Emailga kod jo‘natildi:', user.email);
        } catch (error) {
            console.error('Email jo‘natishda xato:', error);
        }
    
        return { message: 'Ro‘yxatdan o‘tish muvaffaqiyatli, emailga kod yuborildi' };
    }
    

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) return { message: 'Email yoki parol xato' };

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) return { message: 'Email yoki parol xato' };

        const token = this.jwtService.sign({ userId: user.id, email: user.email,role:user.role });
        return { message: 'Login muvaffaqiyatli', token };
    }

    async verifyByEmail(verfyDto:VerifyEmailDto) {
        const user = await this.usersService.findByEmail(verfyDto.email)
        if (!user) {
            throw new NotFoundException("foydalanuvchi topilmadi");
        }
        if (user.emailCode !== verfyDto.code) {
            throw new UnauthorizedException("kod notogri");
        }

        if (user.emailCodeExpiresAt && user.emailCodeExpiresAt < new Date()) {
            // Kod muddati o‘tgan, yangi kod yuborish
            await this.resendVerificationEmail({ email: user.email });
            throw new UnauthorizedException('Kod muddati tugagan, yangi kod emailga yuborildi');
        }
    
        // Email tasdiqlandi, kodni tozalash
        await this.usersService.updateEmailCode(user.id,null,null);

        return { message: "Email muvaffaqiyatli tasdiqlandi" };
    }

    async resendVerificationEmail(dto: ResendVerificationDto) {
        const user = await this.usersService.findByEmail(dto.email);
      
        if (!user) {
          throw new NotFoundException('Foydalanuvchi topilmadi');
        }
      
        // Yangi kod yaratamiz
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
      
        // User jadvalida saqlaymiz
        user.emailCode = newCode;
        await this.usersService.updateEmailCode(user.id,newCode,expiresAt);
      
        // Email yuboramiz
        await this.mailService.sendMail(
          user.email,
          'Email verification code',
          `Tasdiqlash kodi: ${newCode}`,
        );
      
        return { message: 'Tasdiqlash kodi qayta yuborildi' };
      }
      
}
