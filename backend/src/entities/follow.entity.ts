import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('follow')
export class Follow {
  @PrimaryColumn({
    type: 'int',
    name: 'follower_id',
    unique: true,
  })
  followerId: number;

  @PrimaryColumn({
    type: 'int',
    name: 'following_id',
    unique: true,
  })
  followingId: number;

  @Column({
    type: 'datetime',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'following_id' })
  following: User;
}
