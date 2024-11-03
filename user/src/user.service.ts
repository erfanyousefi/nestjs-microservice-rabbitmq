import {HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {compareSync, genSaltSync, hashSync} from "bcrypt";
import {Model} from "mongoose";
import {ILogin, ISignup} from "./interface/user.interface";
import {User, UserDocument} from "./schema/user.schema";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async signup(signupDto: ISignup) {
    let {email, name, password} = signupDto;
    email = email.toLowerCase();
    let user = await this.userModel.findOne({email});
    if (user) {
      return {
        status: HttpStatus.CONFLICT,
        message: "user already exist with this email",
        error: true,
      };
    }
    const salt = genSaltSync();
    const hashed = hashSync(password, salt);
    user = await this.userModel.create({
      name,
      email,
      password: hashed,
    });
    return {
      status: HttpStatus.CREATED,
      message: "user account created successfully",
      data: {
        userId: user._id.toString(),
      },
    };
  }
  async login(loginDto: ILogin) {
    const {email, password} = loginDto;
    const user = await this.userModel.findOne({email});
    if (!user) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: true,
        message: "not found user account",
      };
    }
    if (!compareSync(password, user.password)) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: true,
        message: "username or password is incorrect",
      };
    }
    return {
      status: HttpStatus.OK,
      data: {
        userId: user.id,
      },
    };
  }
  async getById({userId}: {userId: string}) {
    const user = await this.userModel.findOne({_id: userId});
    if (!user) {
      return {
        error: true,
        status: HttpStatus.NOT_FOUND,
        message: "not found user account",
      };
    }
    return {
      status: HttpStatus.OK,
      error: false,
      data: {user},
    };
  }
}
