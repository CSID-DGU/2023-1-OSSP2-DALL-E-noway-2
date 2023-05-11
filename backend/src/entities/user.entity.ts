import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'varchar',
    name: 'nickname',
    length: 255,
    unique: true,
  })
  nickname: string;

  @Column({
    type: 'varchar',
    name: 'image_url',
    length: 255,
  })
  imageUrl: string;

  @Column({
    type: 'varchar',
    name: 'username',
    length: 255,
  })
  username: string;

  @Column({
    type: 'varchar',
    name: 'email',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'presentation',
    length: 255,
    nullable: true,
  })
  presentation: string;

  @Column({
    type: 'int',
    name: 'credits',
    default: 3,
  })
  credits: number;
}
