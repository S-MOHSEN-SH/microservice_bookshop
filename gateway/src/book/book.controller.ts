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
import { JwtAuthGuard } from '../common/guard/auth.guard';
import { RolesGuard } from '../common/guard/role.guard';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async showAllBooks() {
    return this.bookService.showAllBooks();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async findOne(@Param('id') id: number) {
    return this.bookService.findOne(id);
  }

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async update(
    @Param('id') id: number,
    @Body() updateBookDto: Partial<CreateBookDto>,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    return this.bookService.remove(id);
  }
}
