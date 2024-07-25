import { IsString, IsNumber, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  @IsNotEmpty()
  available: boolean;
}
