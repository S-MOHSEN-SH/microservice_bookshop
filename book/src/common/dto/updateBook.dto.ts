import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './book.dto';

export class UpdateBook extends PartialType(CreateBookDto) {}
