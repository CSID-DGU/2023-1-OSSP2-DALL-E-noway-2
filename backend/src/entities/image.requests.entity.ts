import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('image_requests')
export class ImageRequests {
  @PrimaryColumn({
    type: 'int',
    name: 'user_id',
    unique: true,
  })
  userId: number;

  @Column({
    type: 'int',
    name: 'max_request_count',
    default: 3,
  })
  maxRequestCount: number;

  @Column({
    type: 'int',
    name: 'cur_request_count',
    default: 0,
  })
  curRequestCount: number;
}
