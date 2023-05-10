import { FilterType } from 'src/enum/filter.type';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('favorite')
export class Favorite {
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
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
