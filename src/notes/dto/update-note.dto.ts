import { ImageEntity } from '../../images/image.entity';

export class UpdateNoteDto {
  title: string;
  content: string;
  images: ImageEntity[];
  tags: string[];
}
