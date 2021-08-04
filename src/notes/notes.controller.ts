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
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '@nestjs/passport';
import { Note } from './entities/note.entity';
import { UserDto } from '../users/dto/user.dto';

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
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
