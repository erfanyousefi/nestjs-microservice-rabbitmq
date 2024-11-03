import {Module} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {MongooseModule} from "@nestjs/mongoose";
import {Token, TokenSchema} from "./schema/token.schema";
import {TokenController} from "./token.controller";
import {TokenService} from "./token.service";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/microservice-todo"),
    MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}]),
  ],
  controllers: [TokenController],
  providers: [TokenService, JwtService],
})
export class TokenModule {}
