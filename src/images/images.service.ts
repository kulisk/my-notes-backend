import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ImageEntity } from './image.entity';
import { Note } from '../notes/entities/note.entity';
import { ImageDto } from './image.dto';
import { DeleteImageInterface } from '../interfaces';
import { S3Service } from './s3.service';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
    private s3Service: S3Service,
  ) {}

  async create(file, note: Note): Promise<ImageEntity> {
    const image: ImageDto = new ImageDto();
    image.originalName = file.originalname;
    image.key = file.key;
    image.note = note;
    return await this.imageRepository.save(image);
  }

  async copy(imagesToCopy: ImageEntity[], note: Note): Promise<any> {
    for (const imageToCopy of imagesToCopy) {
      const [originalName, extension] = imageToCopy.originalName.split('.');
      const newCustomName = `${originalName}-${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}.${extension}`;
      await this.s3Service.copy(imageToCopy.key, newCustomName);
      const newImage = this.imageRepository.create();
      newImage.key = newCustomName;
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
      await this.s3Service.delete(image.key);
      result.push(await this.imageRepository.delete(image.id));
    }
    return result;
  }
}
