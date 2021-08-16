export class UpdateNoteDto {
  title: string;
  content: string;
  tags: string;
  imagesToDelete: string;
  isPinned: boolean;
}
