// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';
// import { UsersService } from 'src/user/user.service';
// import { JwtService } from '@nestjs/jwt';
// import { MailService } from 'src/mail/mail.service';
// import * as bcrypt from 'bcrypt';

// describe('AuthService', () => {
//   let authService: AuthService;
//   let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
//   let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;
//   let mailService: Partial<Record<keyof MailService, jest.Mock>>;

//   beforeEach(async () => {
//     usersService = {
//       findByEmail: jest.fn(),
//       createUser: jest.fn(),
//       updateEmailCode: jest.fn(),
//     };
//     jwtService = {
//       sign: jest.fn(),
//     };
//     mailService = {
//       sendMail: jest.fn(),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         { provide: UsersService, useValue: usersService },
//         { provide: JwtService, useValue: jwtService },
//         { provide: MailService, useValue: mailService },
//       ],
//     }).compile();

//     authService = module.get<AuthService>(AuthService);
//   });

//   describe('register', () => {
//     it('should register a new user and send verification email', async () => {
//       usersService.findByEmail.mockResolvedValue(null);
//       usersService.createUser.mockResolvedValue({ id: 1, email: 'test@example.com' });

//       await authService.register({
//         email: 'test@example.com',
//         password: '123456',
//         fullName: 'Test User',
//       });

//       expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
//       expect(usersService.createUser).toHaveBeenCalled();
//       expect(mailService.sendMail).toHaveBeenCalled();
//     });

//     it('should throw if user already exists', async () => {
//       usersService.findByEmail.mockResolvedValue({ id: 1, email: 'exists@example.com' });

//       await expect(
//         authService.register({
//           email: 'exists@example.com',
//           password: '123456',
//           fullName: 'Existing User',
//         }),
//       ).rejects.toThrow('Foydalanuvchi allaqachon mavjud');
//     });
//   });

//   describe('login', () => {
//     it('should return token if email and password are correct', async () => {
//       const password = await bcrypt.hash('123456', 10);
//       usersService.findByEmail.mockResolvedValue({
//         id: 1,
//         email: 'user@example.com',
//         password,
//         role: 'user',
//       });
//       jwtService.sign.mockReturnValue('fake-token');

//       const result = await authService.login({
//         email: 'user@example.com',
//         password: '123456',
//       });

//       expect(result.token).toBe('fake-token');
//     });
//   });
// });
