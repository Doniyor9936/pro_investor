import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    // Email log (MVP)
    console.log(`[EMAIL] To: ${user.email}, Body: Ro‘yxatdan o‘tdingiz`);

    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    return { message: 'Ro‘yxatdan o‘tish muvaffaqiyatli', token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) return { message: 'Email yoki parol xato' };

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) return { message: 'Email yoki parol xato' };

    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    return { message: 'Login muvaffaqiyatli', token };
  }

  async sendVerificationToken(email: string) {
    const token = this.jwtService.sign({ email });

    await this.mailService.sendMail(
      email,
      'Your verification token',
      `Token: ${token}`
    );

    return token;
  }
}
