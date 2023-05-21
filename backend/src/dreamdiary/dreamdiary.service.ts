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

@Injectable()
export class DreamDiaryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DreamDiary)
    private readonly dreamDiaryRepository: Repository<DreamDiary>,
    @InjectRepository(DiaryCategory)
    private readonly diaryCategoryRepository: Repository<DiaryCategory>,
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
      .createQueryBuilder('DreamDiary')
      .select([
        'DreamDiary.diaryId',
        'DreamDiary.title',
        'author.nickname',
        'DreamDiary.viewCount',
        'DreamDiary.imageUrl',
      ])
      .where('dream_diary.disclosureScope = :PUBLIC', {
        PUBLIC: DisclosureScopeType.PUBLIC,
      })
      .orderBy('DreamDiary.createdAt', 'DESC')
      .skip((currentPage - 1) * 12)
      .take(length);

    //추가: 현재 userId로 작성한 private 부분도 diary 보여주기

    //if로 searchType을 기준으로 받는 쿼리를 다르게 해야함 ex)닉네임에 경우 NICKNAME
    if (searchType === SearchType.NONE) {
      feedQuery.andWhere(
        'DreamDiary.title =:keyWord OR DreamDiary.content =:keyWord OR author.nickname =:keyWord',
        { keyWord: `${keyWord}` },
      );
    } else if (searchType === SearchType.TITLE) {
      feedQuery.andWhere('DreamDiary.title =:keyWord', {
        keyWord: `${keyWord}`,
      });
    } else if (searchType === SearchType.CONTENT) {
      feedQuery.andWhere('DreamDiary.content =:keyWord', {
        keyWord: `${keyWord}`,
      });
    } else if (searchType === SearchType.NICKNAME) {
      feedQuery.andWhere('author.nickname =:keyWord', {
        keyWord: `${keyWord}`,
      });
    } else {
      throw new BadRequestException('검색결과가 없습니다.');
    }

    const [dreamDiaryFeed, totalLength] = await feedQuery.getManyAndCount();

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
      .createQueryBuilder('DiaryCategory')
      .leftJoinAndSelect('diaryCategory.category', 'category')
      .where('diaryCategory.diary_id = :diaryId', { diaryId })
      .select('category.category_name', 'categoryName')
      .getRawMany();

    if (!dreamDiary) {
      throw new NotFoundException('삭제된 일기입니다.');
    }

    dreamDiary.viewCount += 1;

    await this.dreamDiaryRepository.save(dreamDiary);

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
    //생성일자 저장방법 추가
    const user = await this.userRepository.findOne({
      where: { userId: saveUserId },
    });
    const dreamDiary = new DreamDiary();

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

    const result = await this.dreamDiaryRepository.insert(dreamDiary);
    const diaryId = result.identifiers[0].id as number;
    // category 테이블에서 ID로 조회
    // categoryId, categoryName

    //category 저장 기능 부분.. 추가 구현
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
}

//좋아요,즐겨찾기 기능
