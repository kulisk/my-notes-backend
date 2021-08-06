import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Note } from './entities/note.entity';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { ImagesService } from '../images/images.service';
import { ImageEntity } from '../images/image.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    private usersService: UsersService,
    private imagesService: ImagesService,
  ) {}

  async create(
    { login }: UserDto,
    createNoteDto: CreateNoteDto,
    files: Express.Multer.File[],
  ): Promise<CreateNoteDto> {
    const note = { ...createNoteDto } as Note;
    note.owner = await this.usersService.findOne({ where: { login } });
    const savedNote: Note = await this.noteRepository.save(note);
    files.forEach((value) => this.imagesService.create(value, savedNote));
    return createNoteDto;
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
    return await this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.images', 'image')
      .where('note.id= :id', { id: id })
      .getOne();
  }

  async update(
    id: number,
    updateNote,
    files: Express.Multer.File[],
  ): Promise<UpdateResult> {
    const updateNoteDto: UpdateNoteDto = new UpdateNoteDto();
    for (const [key, value] of Object.entries(updateNote)) {
      updateNoteDto[key] = value;
    }
    const imagesToDelete: ImageEntity[] = await this.imagesService.findByNoteId(
      id,
    );
    imagesToDelete.forEach((item) => this.imagesService.delete(item));
    const noteToUpdate: Note = await this.noteRepository.findOne(id);
    files.forEach((value) => this.imagesService.create(value, noteToUpdate));
    return await this.noteRepository.update(id, updateNoteDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    const imagesToDelete: ImageEntity[] = await this.imagesService.findByNoteId(
      id,
    );
    imagesToDelete.forEach((item) => this.imagesService.delete(item));
    return await this.noteRepository.delete(id);
  }
}
