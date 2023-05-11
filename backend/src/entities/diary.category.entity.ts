import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('diary_category')
export class DiaryCategory {
  @PrimaryColumn({
    type: 'int',
    name: 'diary_id',
  })
  diaryId: number;

  @PrimaryColumn({
    type: 'int',
    name: 'category_id',
  })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.categoryId)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
