import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { RedisService } from 'src/redis/redis.service';
import { timeConstants } from 'src/common/constants/time.constants';
import { cachKeys } from 'src/common/constants/cach.constant';
import { CreateBookDto } from '../common/dto/book.dto';

@Injectable()
export class BookService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async showAllBooks() {
    const cachedKey = cachKeys.BOOKS_ALL;
    const cachedBooks = await this.redisService.get(cachedKey);
    if (cachedBooks) {
      return JSON.parse(cachedBooks);
    }
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.configService.get<string>('BOOK_SERVICE_URL')}`,
      ),
    );
    await this.redisService.set(
      cachedKey,
      JSON.stringify(response.data),
      timeConstants.REDIS_EXP,
    );
    return response.data;
  }

  async findOne(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get<string>('BOOK_SERVICE_URL')}/${id}`,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch the book: ${error.response.data.message}`,
        error.response.status,
      );
    }
  }

  async create(createBookDto: CreateBookDto) {
    const allCachedBooks = cachKeys.BOOKS_ALL;
    await this.redisService.del(allCachedBooks);
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.configService.get<string>('BOOK_SERVICE_URL')}`,
          createBookDto,
        ),
      );
      const cachedKey = `Book_${response.data.id}_${createBookDto.title}`;
      await this.redisService.set(
        cachedKey,
        JSON.stringify(response.data),
        timeConstants.REDIS_EXP,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to post a book: ${error.response.data.message}`,
        error.response.status,
      );
    }
  }

  async update(id: number, updateBookDto: Partial<CreateBookDto>) {
    const allCachedBooks = cachKeys.BOOKS_ALL;
    await this.redisService.del(allCachedBooks);
    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `${this.configService.get<string>('BOOK_SERVICE_URL')}/${id}`,
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

  async remove(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(
          `${this.configService.get<string>('BOOK_SERVICE_URL')}/${id}`,
        ),
      );
      const allCachedBooks = cachKeys.BOOKS_ALL;
      await this.redisService.del(allCachedBooks);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to delete the book: ${error.response.data.message}`,
        error.response.status,
      );
    }
  }
}
