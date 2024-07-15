import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailData } from './interface/mail.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  async sendMail(mailData: MailData) {
    // This one below is for the moment if you wanna use the company's email .

    // const transporter = nodemailer.createTransport({
    //   host: '',
    //   port: 587, // There are 2 ports, one is secure connection and another is not.465 is a secure port using SSL
    //   secure: false,
    //   auth: {
    //     user: '',
    //     pass: '',
    //   },
    // });

    // For now, i am going to use my personal email:

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('PERSONAL_EMAIL'),
        pass: this.configService.get<string>('PERSONAL_PASSWORD'),
      },
    });

    const info = await transporter.sendMail({
      from: `"Example Team" ${this.configService.get<string>('PERSONAL_EMAIL')}`,
      to: mailData.to,
      subject: mailData.subject,
      text: mailData.text,
      html: mailData.html,
    });

    console.log('Message sent: %s', info.messageId);
  }
}
