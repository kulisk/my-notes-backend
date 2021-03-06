import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Note } from '../notes/entities/note.entity';

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    nullable: false,
  })
  originalName: string;

  @Column({
    nullable: false,
    unique: true,
  })
  key: string;

  @ManyToOne((type) => Note)
  note?: Note;
}
