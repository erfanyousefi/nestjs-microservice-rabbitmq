import {Controller} from "@nestjs/common";
import {MessagePattern} from "@nestjs/microservices";
import {TokenService} from "./token.service";

@Controller("token")
export class TokenController {
  constructor(private tokenService: TokenService) {}
  @MessagePattern("create_user_token")
  createToken({userId}: {userId: string}) {
    return this.tokenService.createToken(userId);
  }
  @MessagePattern("verify_token")
  verifyToken({token}: {token: string}) {
    return this.tokenService.verifyToken(token);
  }
  @MessagePattern("token_destroy")
  destroyToken({userId}: {userId: string}) {
    return this.tokenService.destroyToken(userId);
  }
}
