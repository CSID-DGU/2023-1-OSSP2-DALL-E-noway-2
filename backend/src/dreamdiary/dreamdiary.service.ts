import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DreamDiaryFeedDto,
  DreamDiaryFeedsResponseDto,
} from 'src/dto/dreamdiary.feeds.response.dto';
import { DreamDiaryResponseDto } from 'src/dto/dreamdiary.response.dto';
import { DiaryCategory } from 'src/entities/diary.category.entity';
import { User } from 'src/entities/user.entity';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import { SearchType } from 'src/enum/search.type';
import { v4 as uuid } from 'uuid';
import { DreamDiaryUpdateRequestDto } from 'src/dto/dreamdiary.update.request.dto';
import { Category } from 'src/entities/category.entity';
import { Favorite } from 'src/entities/favorite.entity';
import { Bookmark } from 'src/entities/bookmark.entity';
import { FilterType } from 'src/enum/filter.type';
import { ForbiddenException, Logger } from '@nestjs/common';
import { GeneratedImagesResponseDto } from 'src/dto/generated.images.response.dto';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { UserService } from 'src/user/user.service';
import { OpenAIService } from 'src/util/openai.service';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DreamDiaryService {
  private readonly logger = new Logger(DreamDiaryService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DiaryCategory)
    private readonly diaryCategoryRepository: Repository<DiaryCategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Bookmark)
    private readonly bookMarkRepository: Repository<Bookmark>,
    private readonly openAIService: OpenAIService,
    private readonly userService: UserService,
    @InjectRepository(DreamDiary)
    private readonly dreamDiaryRepository: Repository<DreamDiary>,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  /**
   * 사용자가 요청하는 일기의 길이,스크롤(페이지), 검색 시 searchType을 설정하여(전체,제목,내용,닉네임)으로
   * 일기를 검색하는 기능
   *
   * @param searchType
   * @param currentPage
   * @param length
   * @param keyWord
   * @returns
   */
  async getAllFeeds(
    searchType: SearchType,
    currentPage: number,
    length: number,
    keyWord: string,
  ): Promise<DreamDiaryFeedsResponseDto> {
    const feedQuery = this.dreamDiaryRepository
      .createQueryBuilder('dream_diary')
      .leftJoinAndSelect('dream_diary.author', 'author')
      .select([
        'dream_diary.diaryId',
        'dream_diary.title',
        'dream_diary.content',
        'author.nickname',
        'dream_diary.viewCount',
        'dream_diary.imageUrl',
        'dream_diary.createdAt',
      ])
      .where('dream_diary.disclosure_scope = :PUBLIC', {
        PUBLIC: DisclosureScopeType.PUBLIC,
      })
      .orderBy('dream_diary.createdAt', 'DESC');

    //추가: 현재 userId로 작성한 private 부분도 diary 보여주기

    if (searchType === SearchType.NONE) {
      feedQuery.andWhere(
        'dream_diary.title LIKE :keyWord OR author.nickname LIKE :keyWord OR dream_diary.content LIKE :keyWord',
        {
          keyWord: `%${keyWord}%`,
        },
      );
    } else if (searchType === SearchType.TITLE) {
      feedQuery.andWhere('dream_diary.title LIKE :keyWord', {
        keyWord: `%${keyWord}%`,
      });
    } else if (searchType === SearchType.CONTENT) {
      feedQuery.andWhere('dream_diary.content LIKE :keyWord', {
        keyWord: `%${keyWord}%`,
      });
    } else if (searchType === SearchType.NICKNAME) {
      feedQuery.andWhere('author.nickname LIKE :keyWord', {
        keyWord: `%${keyWord}%`,
      });
    }

    const totalLength = await feedQuery.getCount();
    const dreamDiaryFeeds = await feedQuery
      .skip((currentPage - 1) * length)
      .take(length)
      .getMany();

    const dreamDiaryFeedDto: DreamDiaryFeedDto[] = dreamDiaryFeeds.map(
      (dreamDiary) => {
        const dreamDiaryFeed: DreamDiaryFeedDto = {
          diaryId: dreamDiary.diaryId,
          title: dreamDiary.title,
          content: dreamDiary.content,
          viewCount: dreamDiary.viewCount,
          nickname: dreamDiary.author.nickname,
          imageUrl: dreamDiary.imageUrl,
        };
        return dreamDiaryFeed;
      },
    );

    const responseDto: DreamDiaryFeedsResponseDto = {
      dreamDiaryFeeds: dreamDiaryFeedDto,
      totalLength: totalLength,
    };

    return responseDto;
  }

  /**
   * 게시판 상세조회 diaryId를 통해 선택한 일기 세부내용 조회
   * @param diaryId
   * @returns
   */
  async getFeedbyDiaryId(diaryId: number): Promise<DreamDiaryResponseDto> {
    const dreamDiary = await this.dreamDiaryRepository.findOne({
      where: { diaryId: diaryId },
      relations: ['author'],
    });

    if (!dreamDiary) {
      throw new NotFoundException('삭제된 일기입니다.');
    }

    const getCategory = await this.diaryCategoryRepository
      .createQueryBuilder('diary_category')
      .leftJoinAndSelect('diary_category.category', 'category')
      .where('diary_category.diaryId = :diaryId', { diaryId })
      .select('category.categoryName', 'categoryName')
      .getRawMany();

    const categoryNames = getCategory.map((category) => category.categoryName);
    const responseDto = new DreamDiaryResponseDto();

    responseDto.diaryId = dreamDiary.diaryId;
    responseDto.title = dreamDiary.title;
    responseDto.content = dreamDiary.content;
    responseDto.category = categoryNames;
    responseDto.dreamScore = dreamDiary.dreamScore;
    responseDto.viewCount = dreamDiary.viewCount;
    responseDto.user = {
      userId: dreamDiary.author.userId,
      nickname: dreamDiary.author.nickname,
      imageUrl: dreamDiary.author.imageUrl,
    };
    responseDto.createdAt = dreamDiary.createdAt;
    responseDto.diaryImageUrl = dreamDiary.imageUrl;
    responseDto.disclosureScope = dreamDiary.disclosureScope;

    dreamDiary.viewCount += 1;

    await this.dreamDiaryRepository.save(dreamDiary); //조회수 저장

    return responseDto;
  }

  /**
   * 꿈일기 생성 각 Body 내용을 받아서 dreamDiary에 저장
   * @param title
   * @param category
   * @param dreamScore
   * @param disclosureScope
   * @param content
   * @param saveUserId
   * @param imageUrl
   * @returns
   */

  async creatDreamDiary(
    title: string,
    category: number[],
    dreamScore: number,
    disclosureScope: DisclosureScopeType,
    content: string,
    saveUserId: number,
    imageUrl?: string,
  ): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { userId: saveUserId },
    });

    const dreamDiary = new DreamDiary();

    dreamDiary.userId = saveUserId;
    dreamDiary.title = title;
    dreamDiary.dreamScore = dreamScore;
    dreamDiary.disclosureScope = disclosureScope;
    dreamDiary.createdAt = new Date();
    dreamDiary.content = content;
    if (imageUrl) {
      dreamDiary.imageUrl = imageUrl;
    } else {
      dreamDiary.imageUrl =
        this.configService.get<string>('image.defaultImage');
    }

    const result = await this.dreamDiaryRepository.save(dreamDiary);

    const diaryId = result.diaryId;

    const categoryArray = Array.isArray(category) ? category : [category];
    const categories = categoryArray.map((value) =>
      parseInt(String(value).replace(',', ' '), 10),
    );

    for (const categoryId of categories) {
      const category = await this.categoryRepository.findOne({
        where: { categoryId: categoryId },
      });
      if (!category) {
        throw new Error(`Category 목록을 찾을 수 없습니다: ${categoryId}`);
      }
      const diaryCategory = new DiaryCategory();
      diaryCategory.diaryId = diaryId;
      diaryCategory.categoryId = categoryId;
      await this.diaryCategoryRepository.insert(diaryCategory);
    }

    user.credits += 1;

    await this.userRepository.save(user);
    return diaryId;
  }

  /**
   * 꿈일기 수정
   * @param diaryId
   * @param title
   * @param category
   * @param dreamScore
   * @param disclosureScope
   * @param content
   * @param imageUrl
   */
  async updateDreamDiary(
    diaryId: number,
    title: string,
    category: number[],
    dreamScore: number,
    disclosureScope: DisclosureScopeType,
    content: string,
    imageUrl?: string,
  ): Promise<void> {
    const dreamDiary = await this.dreamDiaryRepository.findOne({
      where: { diaryId: diaryId },
    });

    if (!dreamDiary) {
      // 꿈일기를 찾지 못한 경우 예외 처리
      throw new NotFoundException('현재 존재하지 않는 꿈일기 입니다.');
    }

    dreamDiary.title = title;
    dreamDiary.dreamScore = dreamScore;
    dreamDiary.disclosureScope = disclosureScope;
    dreamDiary.content = content;
    dreamDiary.updatedAt = new Date();
    dreamDiary.imageUrl = imageUrl;

    // 기존의 diary_category 레코드 삭제
    await this.diaryCategoryRepository.delete({ diaryId });

    // 새로운 diary_category 레코드 생성
    const categoryArray = Array.isArray(category) ? category : [category]; //
    const categories = categoryArray.map((value) =>
      parseInt(String(value).replace(',', ' '), 10),
    );

    for (const categoryId of categories) {
      const category = await this.categoryRepository.findOne({
        where: { categoryId: categoryId },
      });
      if (!category) {
        throw new Error(`Category 목록을 찾을 수 없습니다: ${categoryId}`);
      }
      const diaryCategory = new DiaryCategory();
      diaryCategory.diaryId = diaryId;
      diaryCategory.categoryId = categoryId;
      await this.diaryCategoryRepository.save(diaryCategory);
    }

    await this.dreamDiaryRepository.insert(dreamDiary);
  }

  /**
   * 꿈일기 삭제(완료)
   * @param diaryId
   * @param authorizedUserId
   */

  async deleteDreamDiary(
    diaryId: number,
    filterType: FilterType,
    authorizedUserId: number,
  ): Promise<void> {
    const diary = await this.dreamDiaryRepository.findOne({
      where: { diaryId: diaryId },
    }); //삭제할 일기

    if (!diary) {
      throw new NotFoundException('해당 일기를 찾을 수 없습니다.');
    }

    if (diary.userId !== authorizedUserId) {
      throw new Error('해당 사용자는 이 일기를 삭제할 권한이 없습니다.');
    }

    await this.dreamDiaryRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .getRepository(Favorite)
          .delete({ id: diaryId, filterType }); //좋아요 삭제
        await transactionalEntityManager
          .getRepository(Bookmark)
          .delete({ id: diaryId, filterType }); //북마크 삭제
        await transactionalEntityManager
          .getRepository(DreamDiary)
          .delete({ diaryId });
      },
    );
  }

  /**
   * 꿈일기좋아요 추가 (완료)
   * @param diaryId
   * @param userId
   */
  async addFavoriteDreamDiary(diaryId: number, userId: number): Promise<void> {
    const dreamDiary = await this.dreamDiaryRepository.findOne({
      where: { diaryId: diaryId },
    });

    if (!dreamDiary) {
      // 꿈일기를 찾지 못한 경우 예외 처리
      throw new NotFoundException('존재하지 않는 꿈일기 입니다.');
    }

    const addFavoriteDiary = new Favorite();
    addFavoriteDiary.id = diaryId;
    addFavoriteDiary.filterType = FilterType.DIARY;
    addFavoriteDiary.userId = userId;
    addFavoriteDiary.createdAt = new Date();

    await this.favoriteRepository.save(addFavoriteDiary);
  }

  /**
   * 꿈일기 좋아요 삭제(완료)
   * @param diaryId
   */
  async deleteFavoriteDreamDiary(
    diaryId: number,
    filterType: FilterType,
    userId: number,
  ): Promise<void> {
    await this.favoriteRepository.delete({
      id: diaryId,
      filterType,
      userId,
    });
  }

  /**
   * 꿈일기 즐겨찾기 추가(완료)
   * @param diaryId
   * @param userId
   */
  async addBookmarkDreamDiary(diaryId: number, userId: number): Promise<void> {
    const dreamDiary = await this.dreamDiaryRepository.findOne({
      where: { diaryId: diaryId },
    });

    if (!dreamDiary) {
      // 꿈일기를 찾지 못한 경우 예외 처리
      throw new NotFoundException('존재하지 않는 꿈일기 입니다.');
    }
    const addBookmarkDiary = new Bookmark();

    addBookmarkDiary.id = diaryId;
    addBookmarkDiary.filterType = FilterType.DIARY; //default값 오류
    addBookmarkDiary.createdAt = new Date();
    addBookmarkDiary.userId = userId;

    await this.bookMarkRepository.save(addBookmarkDiary);
  }

  /**
   * 꿈일기 즐겨찾기 삭제(완료)
   * @param diaryId
   */
  async deleteBookmarkDreamDiary(
    diaryId: number,
    filterType: FilterType,
    userId: number,
  ): Promise<void> {
    await this.bookMarkRepository.delete({ id: diaryId, filterType, userId });
  }

  async createDreamDiaryImages(
    title: string,
    content: string,
    n: number,
    userId: number,
  ): Promise<GeneratedImagesResponseDto> {
    this.logger.debug(`Called ${this.createDreamDiaryImages.name}`);

    const result = await this.userService.getUserWithImageRequestsInfo(userId);
    const maxRequestCount = result.imageRequests.maxRequestCount;
    let curRequestCount = result.imageRequests.curRequestCount;
    let credits = result.credits;

    if (curRequestCount + n > maxRequestCount) {
      if (credits + n > 0) {
        throw new ForbiddenException(
          '무료 이미지 생성 횟수를 초과했습니다. 추가로 이용하시려면 크레딧을 충전해주세요.',
        );
      }
      credits -= n;
      await this.userService.updateUserCredits(userId, credits);
    } else {
      curRequestCount += n;
      await this.userService.updateUserCurRequestCount(userId, curRequestCount);
    }

    const gptPromptForDalle = this.openAIService.constructGPTPromptForDalle(
      title,
      content,
    );
    console.log(gptPromptForDalle);

    let dallePrompt = await this.openAIService.createText(
      gptPromptForDalle,
      'gpt-3.5-turbo',
    );
    if (dallePrompt.length > 1000) {
      dallePrompt = dallePrompt.slice(0, 1000);
    }
    console.log(dallePrompt);

    const images = await this.openAIService.createImage(
      dallePrompt,
      n,
      '512x512',
    );

    return {
      credits,
      freeGenerateCount: curRequestCount,
      maxFreeGenerateCount: maxRequestCount,
      generatedImages: images,
    } as GeneratedImagesResponseDto;
  }

  async createDreamInterpretation(diaryId: number) {
    this.logger.debug(`Called ${this.createDreamInterpretation.name}`);

    const dreamDiary = await this.dreamDiaryRepository.findOne({
      where: { diaryId: diaryId },
    });

    if (!dreamDiary) {
      // 꿈일기를 찾지 못한 경우 예외 처리
      throw new NotFoundException('존재하지 않는 꿈일기 입니다.');
    }

    if (dreamDiary.interpretation) {
      return dreamDiary.interpretation;
    }

    const interpretation = await this.openAIService.createDreamInterpretation(
      dreamDiary.title,
      dreamDiary.content,
    );

    dreamDiary.interpretation = interpretation;

    await this.dreamDiaryRepository.save(dreamDiary);
    return interpretation;
  }
}
