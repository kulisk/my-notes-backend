import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '@nestjs/passport';
import { Note } from './entities/note.entity';
import { UserDto } from '../users/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() createNoteDto: CreateNoteDto, @Req() req: any): Promise<Note> {
    const user = <UserDto>req.user;
    return this.notesService.create(user, createNoteDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll(@Req() req: any) {
    const user = <UserDto>req.user;
    return this.notesService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  update(@Param('id') id: string, @Body() updateNote) {
    const keys = Object.keys(updateNote);
    const values = Object.values(updateNote);
    const updateNoteDto: UpdateNoteDto = {
      title: '',
      content: '',
      images: [],
      tags: [],
    };
    for (let i = 0; i < keys.length; i++) {
      updateNoteDto[keys[i]] = values[i];
    }
    return this.notesService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
