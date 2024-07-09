import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getToken(
    userId: string,
    role: string,
  ): Promise<{ access_token: string }> {
    const token = await this.jwtService.signAsync(
      { userId, role },
      {
        expiresIn: '15m',
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      },
    );
    return { access_token: token };
  }
}
