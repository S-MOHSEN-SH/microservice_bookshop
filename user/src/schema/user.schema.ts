import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date } from 'mongoose';
import { Role } from 'src/common/enum/user.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: String, enum: Role, default: Role.User })
  role: Role;
}
export const UserSchema = SchemaFactory.createForClass(User);
