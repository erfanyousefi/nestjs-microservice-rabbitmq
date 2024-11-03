import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import {HttpArgumentsHost} from "@nestjs/common/interfaces";
import {ClientProxy} from "@nestjs/microservices";
import {Request} from "express";
import {lastValueFrom} from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject("USER_SERVICE") private userClientService: ClientProxy,
    @Inject("TOKEN_SERVICE") private tokenClientService: ClientProxy
  ) {}
  async canActivate(context: ExecutionContext) {
    const httpContext: HttpArgumentsHost = context.switchToHttp();
    const request: Request = httpContext.getRequest();
    const {authorization = undefined} = request?.headers;
    if (!authorization)
      throw new UnauthorizedException("authorization header is required");
    const [bearer, token] = authorization?.split(" ");
    if (!bearer || bearer?.toLowerCase() !== "bearer")
      throw new UnauthorizedException("bearer token is incorrect");
    if (!token) throw new UnauthorizedException("token is required");
    const verifyTokenResponse = await lastValueFrom(
      this.tokenClientService.send("verify_token", {token})
    );
    if (!verifyTokenResponse || verifyTokenResponse?.error) {
      throw new HttpException(
        verifyTokenResponse?.message,
        verifyTokenResponse?.status
      );
    }
    const {data} = verifyTokenResponse;
    if (!data || !data?.userId)
      throw new UnauthorizedException("not found user account");
    const userResponse = await lastValueFrom(
      this.userClientService.send("get_user_by_id", {userId: data?.userId})
    );
    if (userResponse?.error) {
      throw new HttpException(userResponse?.message, userResponse?.status);
    }
    if (!userResponse?.data?.user) {
      throw new UnauthorizedException("not found user account");
    }
    request.user = userResponse?.data?.user;
    return true;
  }
}
