import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';
import { ImagesService } from './images.service';
import { S3Service } from './s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  providers: [ImagesService, S3Service],
  exports: [ImagesService],
})
export class ImagesModule {}
