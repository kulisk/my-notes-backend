import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/user.entity';

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

  @ManyToOne((type) => UserEntity)
  owner?: UserEntity;

  @BeforeInsert()
  async setDefaultValues() {
    this.content = '';
    this.images = [];
    this.tags = [];
    this.isPinned = false;
  }
}
