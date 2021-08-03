import { UserEntity } from '../users/user.entity';
import { UserDto } from '../users/dto/user.dto';

export const toUserDto = (data: UserEntity): UserDto => {
  const { id, login, email } = data;
  const userDto: UserDto = { id, login, email };
  return userDto;
};