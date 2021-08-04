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

  async create(userDto: CreateUserDto): Promise<UserDto> {
    const { login, password, email } = userDto;

    const userInDb = await this.userRepository.findOne({
      where: { login },
    });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user: UserEntity = await this.userRepository.create({
      login,
      password,
      email,
    });
    await this.userRepository.save(user);
    return toUserDto(user);
  }

  async findOne(options?: object): Promise<UserEntity> {
    const user = await this.userRepository.findOne(options);
    return user;
  }

  async findByLogin({ login, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { login } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await bcrypt.compare(password, user.password);
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
