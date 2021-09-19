import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RecoveryService } from './recovery.service';
import { CreateRecoveryDto } from './dto/create-recovery.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('recovery')
export class RecoveryController {
  constructor(private readonly recoveryService: RecoveryService) {}

  @Post()
  create(@Body() createRecoveryDto: CreateRecoveryDto) {
    return this.recoveryService.create(createRecoveryDto);
  }

  @Get(':token')
  findOne(@Param('token') token: string) {
    return this.recoveryService.findOne(token);
  }

  @Delete(':token')
  remove(
    @Param('token') token: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.recoveryService.remove(token, updatePasswordDto);
  }
}
