import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Note } from './entities/note.entity';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { ImagesService } from '../images/images.service';
import { ImageEntity } from '../images/image.entity';
import { CreateResultDto } from './dto/create-result.dto';
import { DeleteImageInterface } from '../interfaces';
import { FindNoteDto } from './dto/find-note.dto';
import { NotesPerPage } from './constants';
import { S3 } from 'aws-sdk';
import { S3_BUCKET_NAME } from '../const';

const s3 = new S3();

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    private usersService: UsersService,
    private imagesService: ImagesService,
  ) {}
  calcSkip = (page: number) => (page - 1) * NotesPerPage;

  async create(
    { login }: UserDto,
    createNoteDto: CreateNoteDto,
    files,
  ): Promise<CreateResultDto> {
    const note = { ...createNoteDto } as Note;
    note.owner = await this.usersService.findOne({ where: { login } });
    const savedNote: Note = await this.noteRepository.save(note);
    const createResultDto = { ...savedNote } as CreateResultDto;
    files.forEach((value) => this.imagesService.create(value, savedNote));
    return createResultDto;
  }

  async copy(id: number, { login }: UserDto): Promise<CreateResultDto> {
    const newNoteDto: FindNoteDto = await this.noteRepository.findOne(id);
    delete newNoteDto.id;
    const newNote: Note = { ...newNoteDto } as Note;
    newNote.owner = await this.usersService.findOne({ where: { login } });
    const imagesToCopy = await this.imagesService.findByNoteId(id);
    const savedNote: Note = await this.noteRepository.save(newNote);
    await this.imagesService.copy(imagesToCopy, savedNote);
    return savedNote as CreateResultDto;
  }

  async findAllInPage(
    { id }: UserDto,
    page: number,
  ): Promise<[Note[], number]> {
    return await this.noteRepository
      .createQueryBuilder('note')
      .where('note.owner= :id', { id: id })
      .orderBy({
        'note.isPinned': 'DESC',
        'note.id': 'DESC',
      })
      .skip(this.calcSkip(page))
      .take(NotesPerPage)
      .getManyAndCount();
  }

  async findOne(id: number): Promise<Note> {
    const images = await this.imagesService.findByNoteId(id);
    for (const image of images) {
      s3.getSignedUrl(
        'putObject',
        {
          Bucket: S3_BUCKET_NAME,
          Key: image.key,
          ACL: 'public-read',
        },
        (err) => {
          if (err) {
            console.log(err);
          }
        },
      );
    }

    return await this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.images', 'image')
      .where('note.id= :id', { id: id })
      .getOne();
  }

  async search(
    term: string,
    page: number,
    { id }: UserDto,
  ): Promise<[Note[], number]> {
    return await this.noteRepository
      .createQueryBuilder('note')
      .where('note.owner= :id', { id: id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('note.title like :term', { term: `${term}%` })
            .orWhere('note.content like :term', { term: `${term}%` })
            .orWhere('note.tags like :term', { term: `%${term}%` });
        }),
      )
      .orderBy({
        'note.isPinned': 'DESC',
        'note.id': 'DESC',
      })
      .skip(this.calcSkip(page))
      .take(NotesPerPage)
      .getManyAndCount();
  }

  async update(id: number, updateNote, files): Promise<UpdateResult> {
    const updateNoteDto: UpdateNoteDto = new UpdateNoteDto();
    let imagesToDelete: DeleteImageInterface[];
    for (const [key, value] of Object.entries(updateNote)) {
      if (key === 'imagesToDelete') {
        imagesToDelete = JSON.parse(updateNote[key]).map(
          (value: DeleteImageInterface) => {
            return { id: value.id, key: value.key };
          },
        );
        continue;
      } else if (key === 'isPinned') {
        updateNoteDto[key] = JSON.parse(value.toString());
        continue;
      }
      updateNoteDto[key] = value;
    }
    await this.imagesService.deleteByIds(imagesToDelete);
    const noteToUpdate: Note = await this.noteRepository.findOne(id);
    files.forEach((value) => this.imagesService.create(value, noteToUpdate));
    return await this.noteRepository.update(id, updateNoteDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    const imagesToDelete: ImageEntity[] = await this.imagesService.findByNoteId(
      id,
    );
    const deleteImages: DeleteImageInterface[] = imagesToDelete.map((image) => {
      return { id: +image.id, key: image.key };
    });
    await this.imagesService.deleteByIds(deleteImages);
    return await this.noteRepository.delete(id);
  }
}
