import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { ImageEntity } from '../../images/image.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column('text', { array: true })
  tags: string[];

  @Column()
  isPinned: boolean;

  @OneToMany((type) => ImageEntity, (image) => image.note)
  images?: ImageEntity[];

  @ManyToOne((type) => UserEntity)
  owner?: UserEntity;
}
