import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'category_id',
  })
  categoryId: number;

  @Column({
    type: 'varchar',
    name: 'category_name',
    length: 255,
  })
  categoryName: string;
}
