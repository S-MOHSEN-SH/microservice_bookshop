import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { LoginUserDto } from 'src/common/dto/login.dto';
import { CreateUserDto } from 'src/common/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('MAILER_SERVICE') private readonly mailerClient: ClientProxy,
  ) {}

  async registerUser(params: CreateUserDto) {
    const user = await this.userClient
      .send({ cmd: 'register_user' }, params)
      .toPromise();
    const token = await this.getToken(user._id, user.role);

    this.mailerClient.emit('send_registeration_email', {
      to: user.email,
      subject: 'Registration Confirmation',
      text: `Welcome ${user.fullname}. Your registration was successful.`,
      html: `<h1>Hello ${user.fullname}</h1><p>Thank you for registering.</p>`,
    });

    return { user, token };
  }

  async loginUser(params: LoginUserDto) {
    const user = await this.userClient
      .send({ cmd: 'user_login' }, params)
      .toPromise();
    const token = await this.getToken(user._id, user.role);
    return { user, token };
  }

  // async getToken(
  //   userId: string,
  //   role: string,
  // ): Promise<{ access_token: string }> {
  //   const token = await this.jwtService.signAsync(
  //     { userId, role },
  //     {
  //       expiresIn: '15m',
  //       secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
  //     },
  //   );
  //   return { access_token: token };
  // }

  async getToken(
    userId: string,
    role: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const accessToken = await this.jwtService.signAsync(
      { userId, role },
      {
        expiresIn: '15m',
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { userId, role },
      {
        expiresIn: '7d',
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      },
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
      return this.getToken(payload.userId, payload.role);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
