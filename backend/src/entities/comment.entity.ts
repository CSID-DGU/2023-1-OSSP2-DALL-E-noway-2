import { FilterType } from 'src/enum/filter.type';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'comment_id',
  })
  commentId: number;

  @Column({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'text',
    name: 'content',
  })
  content: string;

  @Column({
    type: 'enum',
    name: 'filter_type',
    enum: FilterType,
  })
  filterType: FilterType;

  @Column({
    type: 'int',
    name: 'parent_comment_id',
    nullable: true,
  })
  parentCommentId: number;

  @Column({
    type: 'datetime',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'int',
    name: 'user_id',
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  author: User;
}
