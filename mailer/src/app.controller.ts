import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailData } from './interface/mail.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('send_registeration_email')
  async handleSendMail(@Payload() data: MailData) {
    try {
      await this.appService.sendMail(data);
    } catch (error) {
      console.error('There was a problem with sending email', error);
    }
  }
}
