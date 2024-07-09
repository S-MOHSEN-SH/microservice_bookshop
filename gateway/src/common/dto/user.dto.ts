import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

// -------------------------

export class LoginUserDto {
  email: string;
  password: string;
}

// ---------------------

export class UpdateUserDto {
  readonly fullname?: string;
  readonly email?: string;
  readonly password?: string;
}
