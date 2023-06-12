import type { BoardType } from './enum/board.type';
import type { DisclosureScopeType } from './enum/disclosure.scope.type';
export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface Diary {
  title: string;
  category: string;
  dreamScore: number;
  image: string[];
  disclosureScope: DisclosureScopeType;
  content: string;
}

export interface Post {
  title: string;
  image: Blob[];
  disclosureScope: DisclosureScopeType;
  boardType: BoardType;
  content: string;
}

export interface User {
  userId: number;
  nickname: string;
  imageUrl: string;
}

// FIXME: 응답 DTO에도 적용
export interface FollowUser {
  userId: number;
  nickname: string;
  imageUrl: string;
  isFollowed: boolean;
}

export interface Profile {
  user: User;
  followerCount: number;
  followingCount: number;
}

export interface ProfileDetail {
  userId: number;
  username: string;
  email: string;
  nickname: string;
  imageUrl: string;
  presentation: string;
  credits: number;
  followerCount: number;
  followingCount: number;
}

export interface EditedProfile {
  image: Blob;
  nickname: string;
  presentation: string;
}

export interface CalendarDayInfo {
  day: number;
  diaryId: number | null;
  dreamScore: number;
}

export interface CalendarList {
  year: number;
  month: number;
  days: CalendarDayInfo[];
}

export interface DiaryFeed {
  diaryId: number;
  title: string;
  content: string;
  nickname: string;
  viewCount: number;
  imageUrl: string;
  dreamScore: number;
  createdAt: string;
}

export interface Board {
  postId: number;
  title: string;
  viewCount: number;
  nickname: string;
  imageUrl: string;
  createdAt: string;
  content: string;
}

// 카테고리 별 개수 통계
export interface CountStat {
  categoryId: number;
  categoryName: string;
  count: number;
}

// 카테고리 별 평균 점수 통계
export interface ScoreStat {
  categoryId: number;
  categoryName: string;
  scoreAvg: number;
}

// 내 평균 점수와 전체 유저 평균 점수 통계
export interface AverageStat {
  myScoreAvg: number;
  othersScoreAvg: number;
}
