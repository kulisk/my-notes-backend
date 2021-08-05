import { UserEntity } from '../../users/user.entity';
import { ImageEntity } from '../../images/image.entity';

export class CreateNoteDto {
  title: string;
  content: string;
  images: ImageEntity[];
  tags: string[];
  owner?: UserEntity;
  isPinned?: boolean;
}
