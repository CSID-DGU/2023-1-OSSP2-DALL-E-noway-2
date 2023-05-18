import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DreamDiaryFeedDto,
  DreamDiaryFeedsResponseDto,
} from 'src/dto/dreamdiary.feeds.response.dto';
import { DreamDiaryRequestDto } from 'src/dto/dreamdiary.request.dto';
import { DreamDiaryResponseDto } from 'src/dto/dreamdiary.response.dto';
import { UserDto } from 'src/dto/user.dto';
import { DiaryCategory } from 'src/entities/diary.category.entity';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { User } from 'src/entities/user.entity';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import { SearchType } from 'src/enum/search.type';
import { SortType } from 'src/enum/sort.type';
import { Repository } from 'typeorm';

/**
 * 꿈일기 정보를 가져와 dto를 반환하는 service
 */
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

  async getAllFeeds(
    searchType: SearchType,
    currentPage: number,
    length = 12,
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
      .orderBy('DreamDiary.createdAt', 'DESC')
      .skip((currentPage - 1) * 12)
      .take(length);

    //if로 searchType을 기준으로 받는 쿼리를 다르게 해야함 ex)닉네임에 경우 NICKNAME
    if (searchType === SearchType.NONE) {
      feedQuery.where(
        'DreamDiary.title =:keyWord OR DreamDiary.content =:keyWord OR author.nickname =:keyWord',
        { keyWord: `${keyWord}` },
      );
    } else if (searchType === SearchType.TITLE) {
      feedQuery.where('DreamDiary.title =:keyWord', { keyWord: `${keyWord}` });
    } else if (searchType === SearchType.CONTENT) {
      feedQuery.where('DreamDiary.content =:keyWord', {
        keyWord: `${keyWord}`,
      });
    } else if (searchType === SearchType.NICKNAME) {
      feedQuery.where('author.nickname =:keyWord', { keyWord: `${keyWord}` });
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
    // const userDto = new UserDto();
    // userDto.userId = dreamDiary.author.userId; //
    // userDto.nickname = dreamDiary.author.nickname;
    // userDto.imageUrl = dreamDiary.author.imageUrl;

    const responseDto = new DreamDiaryResponseDto();

    responseDto.diaryId = dreamDiary.diaryId;
    responseDto.title = dreamDiary.title;
    responseDto.content = dreamDiary.content;
    responseDto.category = getCategory; //category값 가지고 오는 방법?
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

    //disclosurScope 부분 처리 흠.. 어케하지... 권한부여 변수만들어서??

    //만약 작성자일 경우 삭제,수정 가능 버튼

    return responseDto;
  }

  // async creatDreamDiary(
  //   dreamDiaryRequestDto: DreamDiaryRequestDto,
  // ): Promise<DreamDiary> {
  //   const { title, category, dreamScore, image, disclosureScope, content } =
  //     dreamDiaryRequestDto;
  //   // formdata부분 검색해보기
  //   //.create 사용해서 새 인스턴스 생성하고 .save 저장 return .create로 생성한 변수 반환

  //   //return;
  // }
}
