import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from 'src/common/dto/book.dto';
import { BookModel } from 'src/common/entity/book.model';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async showAllBooks() {
    return this.bookService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.bookService.findOne(id);
  }

  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<BookModel> {
    return this.bookService.create(createBookDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBookDto: Partial<CreateBookDto>,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.bookService.remove(id);
  }
}
