import { Injectable, Inject } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis.Redis,
  ) {}

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, ext: number): Promise<void> {
    await this.redisClient.set(key, value, 'EX', ext); // EX was expiration time
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async findandDelete(bookInfo: string) {
    const keys = await this.redisClient.keys(bookInfo);
    if (keys.length > 0) {
      await this.redisClient.del(keys);
    }
  }
}
