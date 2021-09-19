import { Module } from '@nestjs/common';
import { RecoveryService } from './recovery.service';
import { RecoveryController } from './recovery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recovery } from './entities/recovery.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [RecoveryController],
  providers: [RecoveryService],
  imports: [TypeOrmModule.forFeature([Recovery]), UsersModule],
})
export class RecoveryModule {}
