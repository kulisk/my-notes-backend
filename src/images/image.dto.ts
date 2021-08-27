import { Note } from '../notes/entities/note.entity';

export class ImageDto {
  originalName: string;
  key: string;
  note: Note;
}
