import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('diary_stat_category')
export class DiaryStatCategory {
  @PrimaryColumn({
    type: 'int',
    name: 'diary_stat_id',
  })
  diaryStatId: number;

  @PrimaryColumn({
    type: 'int',
    name: 'category_id',
  })
  categoryId: number;

  @Column({
    type: 'float',
    name: 'average_score',
  })
  averageScore: number;

  @ManyToOne(() => Category, (category) => category.categoryId)
  category: Category;
}
