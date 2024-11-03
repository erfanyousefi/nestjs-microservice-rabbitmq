import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./schema/user.schema";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/microservice-todo"),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
