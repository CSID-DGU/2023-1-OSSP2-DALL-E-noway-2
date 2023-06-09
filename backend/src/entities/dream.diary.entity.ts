// import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToMany,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { User } from './user.entity';
// import { DiaryCategory } from './diary.category.entity';

// @Entity('dream_diary')
// export class DreamDiary {
//   @PrimaryGeneratedColumn({
//     type: 'int',
//     name: 'diary_id',
//   })
//   diaryId: number;

//   @Column({
//     type: 'int',
//     name: 'user_id',
//     unique: true,
//   })
//   userId: number;

//   @Column({
//     type: 'varchar',
//     name: 'title',
//     length: 255,
//   })
//   title: string;

//   @Column({
//     type: 'text',
//     name: 'content',
//   })
//   content: string;

//   @Column({
//     type: 'tinyint',
//     name: 'dream_score',
//   })
//   dreamScore: number;

//   @Column({
//     type: 'int',
//     name: 'view_count',
//     default: 0,
//   })
//   viewCount: number;

//   @Column({
//     type: 'datetime',
//     name: 'created_at',
//     default: () => 'CURRENT_TIMESTAMP',
//   })
//   createdAt: Date;

//   @Column({
//     type: 'datetime',
//     name: 'updated_at',
//     nullable: true,
//   })
//   updatedAt: Date;

//   @Column({
//     type: 'varchar',
//     name: 'image_url',
//     length: 255,
//   })
//   imageUrl: string;

//   @Column({
//     type: 'enum',
//     name: 'disclosure_scope',
//     enum: DisclosureScopeType,
//   })
//   disclosureScope: DisclosureScopeType;

//   @Column({
//     type: 'text',
//     name: 'interpretation',
//     nullable: true,
//   })
//   interpretation: string;

//   @ManyToOne(() => User, (user) => user.userId)
//   @JoinColumn({ name: 'user_id' })
//   author: User;

//   @OneToMany(() => DiaryCategory, (diaryCategory) => diaryCategory.diaryId)
//   diaryCategories: DiaryCategory[];
// }

import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { DiaryCategory } from './diary.category.entity';

@Entity('dream_diary')
export class DreamDiary {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'diary_id',
  })
  diaryId: number;

  @Column({
    type: 'int',
    name: 'user_id',
    unique: true,
  })
  userId: number;

  @Column({
    type: 'varchar',
    name: 'title',
    length: 255,
  })
  title: string;

  @Column({
    type: 'text',
    name: 'content',
  })
  content: string;

  @Column({
    type: 'tinyint',
    name: 'dream_score',
  })
  dreamScore: number;

  @Column({
    type: 'int',
    name: 'view_count',
    default: 0,
  })
  viewCount: number;

  @Column({
    type: 'datetime',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
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
  })
  imageUrl: string;

  @Column({
    type: 'enum',
    name: 'disclosure_scope',
    enum: DisclosureScopeType,
  })
  disclosureScope: DisclosureScopeType;

  @Column({
    type: 'text',
    name: 'interpretation',
    nullable: true,
  })
  interpretation: string;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  author: User;

  @OneToMany(() => DiaryCategory, (diaryCategory) => diaryCategory.dreamDiary)
  diaryCategories: DiaryCategory[];
}
