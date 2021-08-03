import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column('text', { array: true })
  images: string[];

  @Column('text', { array: true })
  tags: string[];

  @Column()
  isPinned: boolean;
}
