import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { use } from 'passport';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async createUser(params: CreateUserDto): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(params.password, 10);
    const newUser = new this.userModel({
      fullname: params.fullname,
      email: params.email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const { password, ...userWithoutPass } = savedUser.toObject();
    return userWithoutPass;
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


  async updateUser(
    userId: string,
    params: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (params.currentPassword && params.newPassword) {
      const isMatch = await bcrypt.compare(
        params.currentPassword,
        user.password,
      );
      if (!isMatch) {
        throw new UnauthorizedException('Current password is incorrect');
      }
      const hashedPassword = await bcrypt.hash(params.newPassword, 10);
      await this.userModel.findByIdAndUpdate(userId, {
        password: hashedPassword,
      });
      delete params.currentPassword;
      delete params.newPassword;
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, params, {
      new: true,
    });
    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword;
  }


  async deleteUser(
    userId: string,
    requesterId: string,
    password?: string,
  ): Promise<string> {
    const requester = await this.userModel.findById(requesterId);
    if (!requester) {
      throw new NotFoundException('Requesting user not found');
    }
    if (requester.role !== 'admin') {
      await this.validateNonAdminUser(userId, password);
    }
    const result = await this.userModel.findByIdAndDelete(userId);
    if (!result) {
      throw new NotFoundException('User to be deleted not found');
    }
    return 'User deleted';
  }


  private async validateNonAdminUser(
    userId: string,
    password?: string,
  ): Promise<void> {
    if (!password) {
      throw new UnauthorizedException(
        'Password is required for non-admin users',
      );
    }
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid password');
    }
  }


  async findUserById(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...userWithoutPass } = user.toObject();
    return userWithoutPass;
  }


  async findAuthUser(userId: string): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      const { password, ...userWithoutPass } = user.toObject();
      return userWithoutPass;
    } catch (error) {
      throw error;
    }
  }


  async findAllUsers(): Promise<Omit<User, 'password'>[]> {
    console.log('before try in user micro')
    try {
      const users = await this.userModel.find();
      console.log('after try in user microservice', users)
      return users.map((user) => {
        const { password, ...userWithoutPass } = user.toObject();
        return userWithoutPass;
      });
    } catch (error) {
      throw error;
    }
  }
}
