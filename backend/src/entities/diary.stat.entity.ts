import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryStatCategory } from './diary.stat.category.entity';

@Entity('diary_stat')
export class DiaryStat {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'diary_stat_id',
  })
  diaryStatId: number;

  @Column({
    type: 'int',
    name: 'user_id',
    unique: true,
  })
  userId: number;

  @Column({
    type: 'int',
    name: 'year',
  })
  year: number;

  @Column({
    type: 'int',
    name: 'month',
  })
  month: number;

  @Column({
    type: 'float',
    name: 'average_score',
  })
  averageScore: number;

  @OneToOne(
    () => DiaryStatCategory,
    (diaryStatCategory) => diaryStatCategory.diaryStatId,
  )
  diaryStatCategory: DiaryStatCategory;
}
