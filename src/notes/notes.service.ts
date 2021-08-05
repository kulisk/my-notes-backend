import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Note } from './entities/note.entity';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { emptyNote } from './constants';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    private usersService: UsersService,
  ) {}

  async create({ login }: UserDto, createNote): Promise<CreateNoteDto> {
    const owner = await this.usersService.findOne({ where: { login } });
    const note: CreateNoteDto = emptyNote;
    for (const [key, value] of Object.entries(createNote)) {
      note[key] = value;
    }
    note.owner = owner;
    note.isPinned = false;
    await this.noteRepository.save(note);
    return note;
  }

  async findAll({ id }: UserDto): Promise<Note[]> {
    return await this.noteRepository.find({
      where: {
        owner: {
          id,
        },
      },
    });
  }

  async findOne(id: number): Promise<Note> {
    return await this.noteRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateNote): Promise<UpdateResult> {
    const updateNoteDto: UpdateNoteDto = emptyNote;
    for (const [key, value] of Object.entries(updateNote)) {
      updateNoteDto[key] = value;
    }
    return await this.noteRepository.update(id, updateNoteDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.noteRepository.delete(id);
  }
}
