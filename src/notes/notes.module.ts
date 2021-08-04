import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../users/user.entity';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([Note, UserEntity]),
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
