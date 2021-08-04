import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Note } from './entities/note.entity';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    private usersService: UsersService,
  ) {}

  async create(
    { login }: UserDto,
    createNoteDto: CreateNoteDto,
  ): Promise<Note> {
    const note: Note = this.noteRepository.create();
    const owner = await this.usersService.findOne({ where: { login } });
    const { title, content, images, tags } = createNoteDto;
    note.title = title;
    note.content = content;
    note.images = images;
    note.tags = tags;
    note.owner = owner;
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

  async update(
    id: number,
    updateNoteDto: UpdateNoteDto,
  ): Promise<UpdateResult> {
    return await this.noteRepository.update(id, updateNoteDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.noteRepository.delete(id);
  }
}
