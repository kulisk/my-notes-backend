import { UserEntity } from '../../users/user.entity';

export class CreateNoteDto {
  title: string;
  content: string;
  images: string[];
  tags: string[];
  owner?: UserEntity;
  isPinned?: boolean;
}
