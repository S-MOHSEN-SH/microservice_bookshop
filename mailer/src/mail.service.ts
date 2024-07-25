
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmationEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Confirmation',
      template: 'confirmation',
      context: {
        name: name,
      },
    });
  }
}
