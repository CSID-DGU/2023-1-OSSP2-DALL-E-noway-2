import { BoardType } from 'src/enum/board.type';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('board')
export class Board {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'post_id',
  })
  postId: number;

  @Column({
    type: 'int',
    name: 'user_id',
    unique: true,
  })
  userId: number;

  @Column({
    type: 'varchar',
    name: 'title',
  })
  title: string;

  @Column({
    type: 'text',
    name: 'content',
  })
  content: string;

  @Column({
    type: 'enum',
    name: 'board_type',
    enum: BoardType,
  })
  boardType: BoardType;

  @Column({
    type: 'int',
    name: 'view_count',
    default: 0,
  })
  viewCount: number;

  @Column({
    type: 'datetime',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'datetime',
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    name: 'image_url',
    length: 255,
    nullable: true,
  })
  imageUrl: string;

  @Column({
    type: 'enum',
    name: 'disclosure_scope',
    enum: DisclosureScopeType,
  })
  disclosureScope: DisclosureScopeType;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  author: User;
}
