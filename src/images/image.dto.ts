import { Note } from '../notes/entities/note.entity';

export class ImageDto {
  originalName: string;
  customName: string;
  path: string;
  note: Note;
}
