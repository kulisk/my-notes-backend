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

  async copy(imagesToCopy: ImageEntity[], note: Note): Promise<any> {
    for (const imageToCopy of imagesToCopy) {
      const [originalName, extension] = imageToCopy.originalName.split('.');
      const newCustomName = `${originalName}-${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}.${extension}`;
      const newPath = 'upload\\' + newCustomName;
      try {
        fs.copyFileSync(imageToCopy.path, newPath);
      } catch (error) {
        console.log(error);
      }
      const newImage = this.imageRepository.create();
      newImage.path = newPath;
      newImage.customName = newCustomName;
      newImage.originalName = originalName;
      newImage.note = note;
      await this.imageRepository.save(newImage);
    }
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
