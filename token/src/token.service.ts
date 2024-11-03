import {HttpStatus, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Token, TokenDocument} from "./schema/token.schema";

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>
  ) {}
  async createToken(userId: string) {
    const token = this.jwtService.sign(
      {userId},
      {
        expiresIn: 60 * 60 * 24,
        secret: "mysecret@++Key",
      }
    );
    const userToken = await this.tokenModel.findOne({userId});
    if (userToken) {
      userToken.token = token;
      await userToken.save();
    } else {
      await this.tokenModel.create({
        userId,
        token,
      });
    }
    return {
      status: HttpStatus.CREATED,
      message: "token created",
      data: {
        token,
      },
    };
  }
  async verifyToken(token: string) {
    try {
      const verified = this.jwtService.verify(token, {
        secret: "mysecret@++Key",
      });
      if (verified?.userId) {
        const existToken = await this.tokenModel.findOne({
          userId: verified.userId,
        });
        console.log(existToken);

        if (!existToken)
          return {
            error: true,
            status: HttpStatus.UNAUTHORIZED,
            message: "token is expired, please login again",
          };
        return {
          data: {
            userId: verified.userId,
          },
          status: HttpStatus.OK,
          error: false,
        };
      }
      return {
        error: true,
        status: HttpStatus.UNAUTHORIZED,
        message: "token is expired, please login again",
      };
    } catch (error) {
      return {
        message: error?.message ?? "invalid token",
        error: true,
        status: HttpStatus.UNAUTHORIZED,
      };
    }
  }
  async destroyToken(userId: string) {
    const existToken = await this.tokenModel.findOne({
      userId,
    });
    if (!existToken)
      return {
        error: true,
        status: HttpStatus.UNAUTHORIZED,
        message: "you'r not login",
      };
    await this.tokenModel.deleteOne({userId});
    return {
      status: HttpStatus.OK,
      message: "token destroy successfully",
      error: false,
    };
  }
}
