import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note: Note = this.noteRepository.create();
    const { title } = createNoteDto;
    note.title = title;
    await this.noteRepository.save(note);
    return note;
  }

  async findAll(): Promise<Note[]> {
    return await this.noteRepository.find();
  }

  async findOne(id: number): Promise<Note> {
    return await this.noteRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updateNoteDto: UpdateNoteDto,
  ): Promise<UpdateResult> {
    return await this.noteRepository.update(id, { title: updateNoteDto.title });
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.noteRepository.delete(id);
  }
}
