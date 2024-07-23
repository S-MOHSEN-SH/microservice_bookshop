// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';
// import { MailData } from './common/interface/mail.interface';
// import { ConfigService } from '@nestjs/config';
// import { compileTemplate } from './common/template/template.helper';

// @Injectable()
// export class AppService {
//   constructor(private readonly configService: ConfigService) {}
//   async sendMail(mailData: MailData) {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: this.configService.get<string>('PERSONAL_EMAIL'),
//         pass: this.configService.get<string>('PERSONAL_PASSWORD'),
//       },
//     });
//     const htmlContent = compileTemplate(mailData.template!, mailData.context);

//     const info = await transporter.sendMail({
//       from: `"Example Team" ${this.configService.get<string>('PERSONAL_EMAIL')}`,
//       to: mailData.to,
//       subject: mailData.subject,
//       text: mailData.text,
//       html: htmlContent,
//     });

//     console.log('Message sent: %s', info.messageId);
//   }
// }

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
