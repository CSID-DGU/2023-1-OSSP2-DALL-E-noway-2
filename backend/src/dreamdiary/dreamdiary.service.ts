import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DreamDiaryFeedDto,
  DreamDiaryFeedsResponseDto,
} from 'src/dto/dreamdiary.feeds.response.dto';
import { DreamDiaryCreateRequestDto } from 'src/dto/dreamdiary.create.request.dto';
import { DreamDiaryResponseDto } from 'src/dto/dreamdiary.response.dto';
import { DiaryCategory } from 'src/entities/diary.category.entity';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { User } from 'src/entities/user.entity';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import { SearchType } from 'src/enum/search.type';
import { SortType } from 'src/enum/sort.type';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DreamDiaryUpdateRequestDto } from 'src/dto/dreamdiary.update.request.dto';
import { Category } from 'src/entities/category.entity';
import { Favorite } from 'src/entities/favorite.entity';
import { Bookmark } from 'src/entities/bookmark.entity';
import { FilterType } from 'src/enum/filter.type';

@Injectable()
export class DreamDiaryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DreamDiary)
    private readonly dreamDiaryRepository: Repository<DreamDiary>,
    @InjectRepository(DiaryCategory)
    private readonly diaryCategoryRepository: Repository<DiaryCategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Bookmark)
    private readonly bookMarkRepository: Repository<Bookmark>,
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
        'author.nickname',
        'dream_diary.viewCount',
        'dream_diary.imageUrl',
      ])
      .where('dream_diary.disclosure_scope = :PUBLIC', {
        PUBLIC: DisclosureScopeType.PUBLIC,
      })
      .orderBy('dream_diary.created_at', 'DESC');

    //추가: 현재 userId로 작성한 private 부분도 diary 보여주기

    //if로 searchType을 기준으로 받는 쿼리를 다르게 해야함 ex)닉네임에 경우 NICKNAME
    if (searchType === SearchType.NONE) {
      feedQuery.andWhere(
        'dream_diary.title =:keyWord OR dream_diary.content =:keyWord OR author.nickname =:keyWord',
        { keyWord: `${keyWord}` },
      );
    } else if (searchType === SearchType.TITLE) {
      feedQuery.andWhere('dream_diary.title =:keyWord', {
        keyWord: `${keyWord}`,
      });
    } else if (searchType === SearchType.CONTENT) {
      feedQuery.andWhere('dream_diary.content =:keyWord', {
        keyWord: `${keyWord}`,
      });
    } else if (searchType === SearchType.NICKNAME) {
      feedQuery.andWhere('author.nickname =:keyWord', {
        keyWord: `${keyWord}`,
      });
    }

    const totalLength = await feedQuery.getCount();

    const dreamDiaryFeed = await feedQuery
      .skip((currentPage - 1) * 12)
      .take(length)
      .getMany();

    const dreamDiaryFeedDto = dreamDiaryFeed.map((dreamDiary) => ({
      diaryId: dreamDiary.diaryId,
      title: dreamDiary.title,
      viewCount: dreamDiary.viewCount,
      nickname: dreamDiary.author.nickname,
      imageUrl: dreamDiary.imageUrl,
    }));

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

    const getCategory = await this.diaryCategoryRepository
      .createQueryBuilder('diary_category')
      .leftJoinAndSelect('diary_category.category', 'category')
      .where('diary_category.diary_id = :diaryId', { diaryId })
      .select('category.category_name', 'categoryName')
      .getRawMany();

    if (!dreamDiary) {
      throw new NotFoundException('삭제된 일기입니다.');
    }

    dreamDiary.viewCount += 1;

    await this.dreamDiaryRepository.save(dreamDiary); //조회수 저장

    const responseDto = new DreamDiaryResponseDto();

    responseDto.diaryId = dreamDiary.diaryId;
    responseDto.title = dreamDiary.title;
    responseDto.content = dreamDiary.content;
    responseDto.category = getCategory; //category값 가지고
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

    return responseDto;
  }

  //꿈일기 리스트 가지고 오기

  /**
   * 꿈일기 생성
   * @param dreamDiaryCreateRequestDto
   * @param saveUserId
   */

  async creatDreamDiary(
    dreamDiaryCreateRequestDto: DreamDiaryCreateRequestDto,
    saveUserId: number,
  ): Promise<void> {
    const { title, category, dreamScore, imageUrl, disclosureScope, content } =
      dreamDiaryCreateRequestDto;

    const user = await this.userRepository.findOne({
      where: { userId: saveUserId },
    });
    const dreamDiary = new DreamDiary();
    const categoryRequest = new DiaryCategory();

    const formData = imageUrl;
    const entries = Object.fromEntries(formData.entries());
    const imageFile = entries['image'];

    const file: Blob = imageFile as any;
    if (file instanceof File) {
      dreamDiary.imageUrl = file.name;
    }
    // 파일 이름 정보가 없는 경우 임의의 이름 저장
    else {
      dreamDiary.imageUrl = uuidv4();
    }

    dreamDiary.userId = user.userId;
    dreamDiary.title = title;
    dreamDiary.dreamScore = dreamScore;
    dreamDiary.disclosureScope = disclosureScope;
    dreamDiary.content = content;
    //크레딧 제한 생성 기능 추가(쿼리문 만들어서 createdAt부분.. 처리해야하는데..  )

    const result = await this.dreamDiaryRepository.insert(dreamDiary);
    const diaryId = result.identifiers[0].id as number;

    categoryRequest.diaryId = diaryId;
    categoryRequest.categoryId = category;

    await this.diaryCategoryRepository.save(categoryRequest);

    // categoryId, categoryName

    // 전체 카테고리 목록을 제공해주는 API 필요
  }

  // async updateDreamDiary(
  //   diaryId: number,
  //   dreamDiaryUpdateDto: DreamDiaryUpdateRequestDto,
  // ): Promise<DreamDiaryUpdateRequestDto> {
  //   const { title, category, dreamScore, imageUrl, disclosureScope, content } =
  //     dreamDiaryUpdateDto;

  //   const dreamDiary = await this.dreamDiaryRepository.findOne({
  //     where: { diaryId: diaryId },
  //   });

  //   dreamDiary.title = title;
  //   dreamDiary.dreamScore = dreamScore;
  //   dreamDiary.disclosureScope = disclosureScope;
  //   dreamDiary.content = content;

  //   //기존 diaryId의 내용들 반환해서 보여주고
  //   // user 수정 -> save로 저장
  // }

  /**
   * 꿈일기 삭제
   * @param diaryId
   * @param authorizedUserId
   */

  async deleteDreamDiary(
    diaryId: number,
    authorizedUserId: number,
  ): Promise<void> {
    const diary = await this.dreamDiaryRepository.findOne({
      where: { diaryId: diaryId },
    }); //삭제할 일기

    if (diary.userId !== authorizedUserId) {
      throw new Error('해당 사용자는 이 일기를 삭제할 권한이 없습니다.');
    }

    await this.dreamDiaryRepository.remove(diary); //일기 삭제
  }

  /**
   * 꿈일기좋아요 추가
   * @param diaryId
   * @param userId
   */
  async addFavoriteDreamDiary(
    diaryId: number,
    userId: number,
  ): Promise<Favorite> {
    const addFavoriteDiary = new Favorite();

    const favoriteDiary = this.favoriteRepository.create(addFavoriteDiary);
    addFavoriteDiary.id = diaryId;
    addFavoriteDiary.filterType = FilterType.DIARY;
    addFavoriteDiary.userId = userId;
    addFavoriteDiary.createdAt = new Date();

    return await this.favoriteRepository.save(favoriteDiary);
  }

  /**
   * 꿈일기 좋아요 삭제
   * @param diaryId
   */
  async deleteFavoriteDreamDiary(diaryId: number): Promise<void> {
    const deleteFavoriteDiary = await this.favoriteRepository.findOne({
      where: { id: diaryId },
    });

    await this.favoriteRepository.remove(deleteFavoriteDiary);
  }

  /**
   * 꿈일기 즐겨찾기 추가
   * @param diaryId
   * @param userId
   */
  async addBookmarkDreamDiary(
    diaryId: number,
    userId: number,
  ): Promise<Bookmark> {
    const addBookmarkDiary = new Bookmark();

    const bookMarkDiary = this.bookMarkRepository.create(addBookmarkDiary);

    addBookmarkDiary.id = diaryId;
    addBookmarkDiary.filterType = FilterType.DIARY;
    addBookmarkDiary.createdAt = new Date();
    addBookmarkDiary.userId = userId;

    return await this.bookMarkRepository.save(bookMarkDiary);
  }

  /**
   * 꿈일기 즐겨찾기 삭제
   * @param diaryId
   */
  async deleteBookmarkDreamDiary(diaryId: number): Promise<void> {
    const deleteBookmarkDiary = await this.bookMarkRepository.findOne({
      where: { id: diaryId },
    });

    await this.bookMarkRepository.remove(deleteBookmarkDiary);
  }
}

//좋아요,즐겨찾기  추가 기능
//일기 저장 diary_id  저장하고 filter_type은 'DIARY'로 저장

//좋아요,즐겨찾기 삭제 기능
//favorite entity랑 bookmark entity를 diary_id를 통해 삭제
