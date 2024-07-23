import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBookDto } from 'src/common/dto/book.dto';
import { UpdateBook } from 'src/common/dto/updateBook.dto';
import { BookModel } from 'src/common/entity/book.model';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(BookModel)
    private readonly bookModel: typeof BookModel,
  ) {}

  async findAll(): Promise<BookModel[]> {
    return this.bookModel.findAll();
  }

  async create(createBookDto: CreateBookDto): Promise<BookModel> {
    const book = new this.bookModel(createBookDto);
    return book.save();
  }

  async findOne(id: number): Promise<BookModel> {
    const book = await this.bookModel.findByPk(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBook): Promise<BookModel> {
    const book = await this.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book.update(updateBookDto);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    await book.destroy();
  }
}
