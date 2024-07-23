import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomJwtService {
  constructor(private configService: ConfigService) {}

  private base64UrlEncode(input: Buffer): string {
    return input
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  sign(payload: any, expiresIn: string, secretKey: string): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };
    const encodedHeader = this.base64UrlEncode(
      Buffer.from(JSON.stringify(header)),
    );
    const exp = Math.floor(Date.now() / 1000) + expiresIn;
    const encodedPayload = this.base64UrlEncode(
      Buffer.from(JSON.stringify({ ...payload, exp })),
    );
    const secretBuffer = Buffer.from(secretKey, 'utf-8');

    const signature = crypto
      .createHmac('sha256', secretBuffer)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64');

    const encodedSignature = this.base64UrlEncode(Buffer.from(signature));

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  verify(token: string, secretKey: string): any {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    const secretBuffer = Buffer.from(secretKey, 'utf-8');

    const expectedSignature = crypto
      .createHmac('sha256', secretBuffer)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64');
    const encodedSignature = this.base64UrlEncode(
      Buffer.from(expectedSignature),
    );

    if (signature !== encodedSignature) {
      throw new Error('Invalid token');
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64').toString(),
    );
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }

    return payload;
  }
}
