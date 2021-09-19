import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Recovery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  token: string;
}
