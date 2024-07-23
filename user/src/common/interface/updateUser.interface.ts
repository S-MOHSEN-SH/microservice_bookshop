import { UpdateUserDto } from '../dto/user.dto';

export interface updateUser {
  userId: string;
  params: UpdateUserDto;
}
