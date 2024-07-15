import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly author: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'The price can not be negative ' })
  readonly price: number;

  @IsBoolean()
  @IsNotEmpty()
  readonly available: boolean;
}
