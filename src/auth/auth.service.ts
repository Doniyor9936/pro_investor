import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { VerifyEmailDto } from './dto/verfy.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private mailService: MailService,
    ) { }

    async register(registerDto: RegisterDto) {
        function generateEmailCode(): string {
            return Math.floor(100000 + Math.random() * 900000).toString(); // 6 xonali raqam
        }
        const code = generateEmailCode();
        console.log(code);
        
        const existsUser = await this.usersService.findByEmail(registerDto.email)
        if (existsUser) {
            throw new ConflictException("user allaqachon mavjud");

        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.usersService.createUser({
            ...registerDto,
            password: hashedPassword,
            emailCode: code

        });


        try {
            await this.mailService.sendMail(
                user.email,
                'Ro‘yxatdan o‘tish kodi',
                `Sizning ro‘yxatdan o‘tish kodingiz: ${code}`
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
        return { message: "Email muvaffaqiyatli tasdiqlandi" };
    }
}
