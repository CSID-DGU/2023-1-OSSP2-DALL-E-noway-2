import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DreamDiaryCategoryCount } from 'src/dto/stat.category.count.response.dto';
import { DreamDiaryCategoryScoreAvg } from 'src/dto/stat.score.avg.response.dto';
import { DreamScoreAverageResponseDto } from 'src/dto/stat.total.score.avg.dto';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatService {
  constructor(
    @InjectRepository(DreamDiary)
    private readonly dreamDiaryRepository: Repository<DreamDiary>,
  ) {}

  async getUserDreamDiaryCategoryCounts(
    userId: number,
    year: number,
    month: number,
  ): Promise<DreamDiaryCategoryCount[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    try {
      const categoryCounts = await this.dreamDiaryRepository
        .createQueryBuilder('dream_diary')
        .select('categories.categoryId', 'categoryId')
        .addSelect('categories.categoryName', 'categoryName')
        .addSelect('COUNT(*)', 'count')
        .innerJoin('dream_diary.diaryCategories', 'diaryCategories')
        .innerJoin('diaryCategories.category', 'categories')
        .innerJoin('dream_diary.author', 'user')
        .where('user.userId = :userId', { userId })
        .andWhere('dream_diary.createdAt >= :startDate', { startDate })
        .andWhere('dream_diary.createdAt <= :endDate', { endDate })
        .groupBy('categories.categoryId')
        .getRawMany();

      return categoryCounts;
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }

  async getUserDreamDiaryScoreAvg(
    userId: number,
    year: number,
    month: number,
  ): Promise<DreamDiaryCategoryScoreAvg[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    try {
      const categoryScoreAvgs = await this.dreamDiaryRepository
        .createQueryBuilder('dream_diary')
        .select('categories.categoryId', 'categoryId')
        .addSelect('categories.categoryName', 'categoryName')
        .addSelect('ROUND(AVG(dream_diary.dreamScore), 1)', 'scoreAvg')
        .innerJoin('dream_diary.diaryCategories', 'diaryCategories')
        .innerJoin('diaryCategories.category', 'categories')
        .innerJoin('dream_diary.author', 'user')
        .where('user.userId = :userId', { userId })
        .andWhere('dream_diary.createdAt >= :startDate', { startDate })
        .andWhere('dream_diary.createdAt <= :endDate', { endDate })
        .groupBy('categories.categoryId')
        .getRawMany();

      return categoryScoreAvgs;
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }

  async getDreamScoreAverage(
    userId: number,
    year: number,
    month: number,
  ): Promise<DreamScoreAverageResponseDto> {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const [myAvgScoreResult, othersAvgScoreResult] = await Promise.all([
        this.dreamDiaryRepository
          .createQueryBuilder('dream_diary')
          .select('ROUND(AVG(dream_diary.dreamScore), 1)', 'myAvgScore')
          .innerJoin('dream_diary.author', 'user')
          .where('user.userId = :userId', { userId })
          .andWhere('dream_diary.createdAt >= :startDate', { startDate })
          .andWhere('dream_diary.createdAt <= :endDate', { endDate })
          .getRawOne(),
        this.dreamDiaryRepository
          .createQueryBuilder('dream_diary')
          .select('ROUND(AVG(dream_diary.dreamScore) ,1)', 'othersAvgScore')
          .innerJoin('dream_diary.author', 'user')
          .where('user.userId != :userId', { userId })
          .andWhere('dream_diary.createdAt >= :startDate', { startDate })
          .andWhere('dream_diary.createdAt <= :endDate', { endDate })
          .getRawOne(),
      ]);

      const myAvgScore = myAvgScoreResult?.myAvgScore || 0;
      const othersAvgScore = othersAvgScoreResult?.othersAvgScore || 0;
      const dto: DreamScoreAverageResponseDto = {
        myAvgScore: myAvgScore,
        othersAvgScore: othersAvgScore,
      };

      return dto;
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }
}
