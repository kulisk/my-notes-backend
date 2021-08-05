import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from './image.entity';
import { Note } from '../notes/entities/note.entity';
import { ImageDto } from './image.dto';
import * as fs from 'fs';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
  ) {}

  async create(file: Express.Multer.File, note: Note): Promise<ImageEntity> {
    const image: ImageDto = new ImageDto();
    image.originalName = file.originalname;
    image.customName = file.filename;
    image.path = file.path;
    image.note = note;
    // const savedImage: ImageEntity = await this.imageRepository.save(image);
    return this.imageRepository.save(image);
  }

  async findByNoteId(id: number): Promise<ImageEntity[]> {
    return await this.imageRepository.find({ where: { note: { id } } });
  }

  async delete(image: ImageEntity): Promise<any> {
    try {
      fs.unlinkSync(image.path);
    } catch (err) {
      console.error(err);
    }
    return this.imageRepository.delete(image.id);
  }
}
