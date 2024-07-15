import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorator/role.decorator';
import { Role } from '../common/enum/role.enum';
import { CreateBookDto } from '../common/dto/book.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../common/guard/auth.guard';
import { RolesGuard } from '../common/guard/role.guard';
import { timeConstants, urlConstants } from 'src/common/constants';
import { RedisService } from 'src/redis/redis.service';

@Controller('book')
export class BookController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async showAllBooks() {
    const cachedKey = 'all-books';
    const cachedBooks = await this.redisService.get(cachedKey);

    if (cachedBooks) {
      return JSON.parse(cachedBooks);
    }
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get<string>('BOOK_SERVICE_URL')}/${urlConstants.book}`,
        ),
      );

      await this.redisService.set(
        cachedKey,
        JSON.stringify(response.data),
        timeConstants.redisExp,
      );
      return response.data;
    } catch (error) {
      console.error('Error occurred while fetching the books:', error);
      throw new HttpException(
        `Failed to fetch the books: ${error.response.data.message}`,
        error.response.status,
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async findOne(@Param('id') id: number) {
    const cachedKey = `Book_${id}`;
    const cachedBook = await this.redisService.get(cachedKey);

    if (cachedBook) {
      return JSON.parse(cachedBook);
    }
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get<string>('BOOK_SERVICE_URL')}/${urlConstants.book}/${id}`,
        ),
      );
      await this.redisService.set(cachedKey, JSON.stringify(response), 3600);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch the book: ${error.response.data.message}`,
        error.response.status,
      );
    }
  }

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createBookDto: CreateBookDto) {
    const pattern = `Book_*_${createBookDto.title}`;
    await this.redisService.findandDeleteOldStuff(pattern);

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.configService.get<string>('BOOK_SERVICE_URL')}/${urlConstants.book}`,
          createBookDto,
        ),
      );

      const cachedKey = `Book_${response.data.id}_${createBookDto.title}`;
      await this.redisService.set(
        cachedKey,
        JSON.stringify(response.data),
        3600,
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to post a book: ${error.response.data.message}`,
        error.response.status,
      );
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async update(
    @Param('id') id: number,
    @Body() updateBookDto: Partial<CreateBookDto>,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `${this.configService.get<string>('BOOK_SERVICE_URL')}/${urlConstants.book}/${id}`,
          updateBookDto,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to update a book: ${error.response.data.message}`,
        error.response.status,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(
          `${this.configService.get<string>('BOOK_SERVICE_URL')}/${urlConstants.book}/${id}`,
        ),
      );
      await this.redisService.del(`Book_${id}`);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to delete the book: ${error.response.data.message}`,
        error.response.status,
      );
    }
  }
}
