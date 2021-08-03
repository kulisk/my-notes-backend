import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

// import { PassportModule } from "@nestjs/passport";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(login: keyof UserEntity, password: string): Promise<any> {
    const users = await this.usersService.findOne(login);
    if (users.length !== 1) {
      console.log('Founded users array has a wrong length');
      return null;
    }
    const user: UserEntity = users[0];
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {}

  async registration(userDto: CreateUserDto) {}
}
