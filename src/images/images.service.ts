import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ImageEntity } from './image.entity';
import { Note } from '../notes/entities/note.entity';
import { ImageDto } from './image.dto';
import * as fs from 'fs';
import { DeleteImageInterface } from '../interfaces';

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
    return await this.imageRepository.save(image);
  }

  async findByNoteId(id: number): Promise<ImageEntity[]> {
    return await this.imageRepository.find({ where: { note: { id } } });
  }

  async deleteByIds(images: DeleteImageInterface[]): Promise<DeleteResult[]> {
    const result: DeleteResult[] = [];
    if (!images) {
      return result;
    }
    for (const image of images) {
      try {
        fs.unlinkSync(image.path);
      } catch (err) {
        console.error(err);
      }
      result.push(await this.imageRepository.delete(image.id));
    }
    return result;
  }

  async delete(image: ImageEntity): Promise<DeleteResult> {
    try {
      fs.unlinkSync(image.path);
    } catch (err) {
      console.error(err);
    }
    return await this.imageRepository.delete(image.id);
  }
}
