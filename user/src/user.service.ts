import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
} from './common/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async createUser(params: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(params.password, 10);
    const newUser = new this.userModel({
      fullname: params.fullname,
      email: params.email,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async login(params: LoginUserDto) {
    const user = await this.userModel.findOne({ email: params.email });
    if (!user) {
      throw new ForbiddenException(`User doesn't exist!`);
    }
    const matchedPass = await bcrypt.compare(params.password, user.password);
    if (!matchedPass) {
      throw new ForbiddenException('Wrong password!');
    }
    return user;
  }

  async updateUser(userId: string, params: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(userId, params, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteUser(userId: string): Promise<string> {
    const result = await this.userModel.findByIdAndDelete(userId);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return 'user deleted';
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
