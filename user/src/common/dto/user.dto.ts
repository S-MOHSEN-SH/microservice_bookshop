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
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

// ---------------------

export class UpdateUserDto {
  fullname?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}
