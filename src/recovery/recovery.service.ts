import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRecoveryDto } from './dto/create-recovery.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recovery } from './entities/recovery.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '@sendgrid/mail';

@Injectable()
export class RecoveryService {
  constructor(
    @InjectRepository(Recovery)
    private recoveryRepository: Repository<Recovery>,
    private usersService: UsersService,
  ) {}

  async create({ email }: CreateRecoveryDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const token = uuidv4();
    const recovery = await this.recoveryRepository.save({ email, token });
    await this.sendMail(email, token);
    return recovery;
  }

  async sendMail(email: string, token: string) {
    const sendgridMail = new MailService();
    sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
    const API_URL = process.env.API_URL;
    const SENDER_EMAIL = process.env.EMAIL;
    const message = {
      to: email,
      from: SENDER_EMAIL,
      subject: 'My notes password recovery',
      text: `Your password recovery link: ${API_URL}recover/${token}`,
      html: `<p>Your password recovery link: <a href="${API_URL}recover/${token}">${API_URL}recover/${token}</a></p>`,
    };
    sendgridMail.send(message).catch((error) => {
      console.error('Error in sending email', error);
    });
  }

  async findOne(token: string) {
    const foundRecovery = await this.recoveryRepository.findOne({
      where: { token },
    });
    if (!foundRecovery) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }
    return foundRecovery;
  }

  async remove(token: string, updatePasswordDto: UpdatePasswordDto) {
    const foundRecovery = await this.findOne(token);
    const user = await this.usersService.findByEmail(foundRecovery.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    await this.usersService.update(user.id.toString(), updatePasswordDto);
    return await this.recoveryRepository.delete(foundRecovery.id);
  }
}
