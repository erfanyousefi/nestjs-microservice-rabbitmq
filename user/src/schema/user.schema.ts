import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

@Schema()
export class User {
  @Prop({required: true})
  name: string;
  @Prop({required: true, unique: true})
  email: string;
  @Prop({required: true})
  password: string;
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
