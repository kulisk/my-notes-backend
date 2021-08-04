import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { JwtPayload } from './jwt.strategy';
import { jwtConstants } from './constants';

export interface RegistrationStatus {
  success: boolean;
  message: string;
}

export interface LoginStatus {
  login: object;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    const user = await this.usersService.findByLogin(loginUserDto);
    // console.log(user);
    const token = this._createToken(user);

    return {
      login: user.login,
      ...token,
    };
  }

  private _createToken({ login }: UserDto): any {
    const user: JwtPayload = { login };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn: jwtConstants.expiresIn,
      accessToken,
    };
  }

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };
    try {
      await this.usersService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }
}
