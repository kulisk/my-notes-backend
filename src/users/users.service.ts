import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { toUserDto } from '../shared/mapper';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(userDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user: UserEntity = this.userRepository.create();
      const { login, email, password } = userDto;

      user.login = login;
      user.email = email;
      user.password = password;

      await this.userRepository.save(user);
      return user;
    } catch (e) {
      console.log('User was not created', e);
    }
  }

  async findOne(options?: object): Promise<UserDto> {
    const user = await this.userRepository.findOne(options);
    return toUserDto(user);
  }

  async findByLogin({ login, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { login } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await bcrypt.compare(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return toUserDto(user);
  }

  async findByPayload({ login }: any): Promise<UserDto> {
    return await this.findOne({
      where: { login },
    });
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find();
    } catch (e) {
      console.log('Users not found', e);
    }
  }
}
