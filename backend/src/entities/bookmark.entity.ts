import { FilterType } from 'src/enum/filter.type';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('bookmark')
export class Bookmark {
  @PrimaryColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @PrimaryColumn({
    type: 'enum',
    name: 'filter_type',
    enum: FilterType,
  })
  filterType: FilterType;

  @Column({
    type: 'int',
    name: 'user_id',
    unique: true,
  })
  userId: number;

  @Column({
    type: 'datetime',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
