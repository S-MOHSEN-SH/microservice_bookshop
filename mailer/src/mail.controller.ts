import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailData } from './common/interface/mail.interface';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern('send_registration_email')
  async handleSendMail(@Payload() data: MailData) {
    await this.mailService.sendConfirmationEmail(data.to, data.name);
  }
}
