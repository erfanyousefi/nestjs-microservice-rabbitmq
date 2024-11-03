import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Post,
  Req,
} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {ApiConsumes, ApiTags} from "@nestjs/swagger";
import {Request} from "express";
import {catchError, lastValueFrom} from "rxjs";
import {Authorization} from "./decorators/auth.decorator";
import {LoginDto, UserSignupDto} from "./dto/user.dto";

@Controller("/user")
@ApiTags("user")
export class UserController {
  constructor(
    @Inject("USER_SERVICE") private userClientService: ClientProxy,
    @Inject("TOKEN_SERVICE") private tokenClientService: ClientProxy
  ) {}

  @Post("signup")
  @ApiConsumes("application/x-www-form-urlencoded")
  async signup(@Body() signupDto: UserSignupDto) {
    const response = await lastValueFrom(
      this.userClientService.send("signup", signupDto).pipe(
        catchError((err) => {
          throw err;
        })
      )
    );
    if (response?.error) {
      throw new HttpException(response?.message, response?.status ?? 500);
    }
    if (response?.data?.userId) {
      const tokenResponse = await lastValueFrom(
        this.tokenClientService.send("create_user_token", {
          userId: response?.data?.userId,
        })
      );
      if (tokenResponse?.data?.token) {
        return {
          token: tokenResponse?.data?.token,
        };
      }
    }
    throw new InternalServerErrorException("some service is missing");
  }
  @Post("login")
  @ApiConsumes("application/x-www-form-urlencoded")
  async login(@Body() loginDto: LoginDto) {
    const response = await lastValueFrom(
      this.userClientService.send("login", loginDto).pipe(
        catchError((err) => {
          throw err;
        })
      )
    );
    if (response?.error) {
      throw new HttpException(response?.message, response?.status ?? 500);
    }
    if (response?.data?.userId) {
      const tokenResponse = await lastValueFrom(
        this.tokenClientService.send("create_user_token", {
          userId: response?.data?.userId,
        })
      );
      if (tokenResponse?.data?.token) {
        return {
          token: tokenResponse?.data?.token,
        };
      }
    }
    throw new InternalServerErrorException("some service is missing");
  }
  @Get("check-login")
  @Authorization()
  async checkLogin(@Req() req: Request) {
    return req?.user;
  }
  @Get("logout")
  @Authorization()
  async logout(@Req() req: Request) {
    const {_id} = req?.user;
    const response = await lastValueFrom(
      this.tokenClientService.send("token_destroy", {userId: _id})
    );
    if (response?.error) {
      throw new HttpException(
        response?.message,
        response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return {
      message: response?.message,
    };
  }
}
