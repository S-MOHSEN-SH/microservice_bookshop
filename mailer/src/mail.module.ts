// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';

// @Module({
//   imports: [ConfigModule.forRoot({ isGlobal: true })],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          // host: configService.get<string>('MAIL_HOST'),
          // port: configService.get<number>('MAIL_PORT'),
          service: 'gmail',
          secure: false,
          auth: {
            user: configService.get<string>('PERSONAL_EMAIL'),
            pass: configService.get<string>('PERSONAL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('PERSONAL_EMAIL')}>`,
        },
        template: {
          dir: join(__dirname, 'common', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
