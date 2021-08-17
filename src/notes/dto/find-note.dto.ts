import { UserEntity } from '../../users/user.entity';

export class FindNoteDto {
  id: number;
  title: string;
  content: string;
  tags: string;
  isPinned: boolean;
  owner?: UserEntity;
}
