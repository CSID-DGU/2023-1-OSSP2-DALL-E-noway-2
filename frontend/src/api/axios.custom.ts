import type { BoardType } from '@/types/enum/board.type';
import type { searchType } from '@/types/enum/search.type';
import type { AxiosResponse } from 'axios';
import { axiosInstance } from './axios.instance';

const postDreamDiaryURL = '/api/dream-diary';
export const postDreamDiary = async (dreamDiaryCreateRequest: FormData) => {
  const response = await axiosInstance.postForm(
    postDreamDiaryURL,
    dreamDiaryCreateRequest,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response;
};

const postDreamImageUrl = '/api/dream-diary/dream-images';
export const postDreamImage = async (
  title: string,
  content: string,
  n: number,
) => {
  const response = await axiosInstance.post(postDreamImageUrl, {
    title,
    content,
    n,
  });
  return response;
};

const getCreditInfoUrl = '/api/users/credit-info';
export const getCreditInfo = async () => {
  const response = await axiosInstance.get(getCreditInfoUrl);
  return response;
};

export const postNewPost = async (
  newPostRequest: FormData,
  boardType: BoardType,
) => {
  const response = await axiosInstance.postForm(
    `/api/boards/posts/${boardType}`,
    newPostRequest,
  );
  return response;
};

export const getProfile = async (userId: number) => {
  const response = await axiosInstance.get(`/api/users/${userId}/profile`);
  return response;
};

export const getMyInfo = async () => {
  const response = await axiosInstance.get('/api/users/me');
  return response;
};

export const getFollowers = async (
  userId: number,
  page: number,
  length: number,
) => {
  const response = await axiosInstance.get(
    `/api/users/${userId}/follower/?page=${page}&length=${length}`,
  );
  return response;
};

export const getFollowings = async (
  userId: number,
  page: number,
  length: number,
) => {
  const response = await axiosInstance.get(
    `/api/users/${userId}/following?page=${page}&length=${length}`,
  );
  return response;
};

export const postFollow = async (userId: number) => {
  const response = await axiosInstance.post(`/api/users/${userId}/follow`);
  return response;
};

export const deleteFollow = async (userId: number) => {
  const response = await axiosInstance.delete(`/api/users/${userId}/follow`);
  return response;
};

export const getProfileDetail = async (userId: number) => {
  const response = await axiosInstance.get(
    `/api/users/${userId}/profile-detail`,
  );
  return response;
};

export const updateProfileRequest = async (
  image?: Blob,
  nickname?: string,
  presentation?: string,
) => {
  let response;
  const url = '/api/users/profile';
  if (image) {
    const formData = new FormData();
    formData.append('image', image);
    if (nickname) formData.append('nickname', nickname);
    if (presentation) formData.append('presentation', presentation);
    response = await axiosInstance.putForm(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } else {
    response = await axiosInstance.put(url, {
      nickname,
      presentation,
    });
  }
  return response;
};

export const getUserDiaryFeeds = async (
  userId: number,
  page: number,
  length: number,
) => {
  const response = await axiosInstance.get(
    `/api/users/${userId}/dream-diary/feeds?page=${page}&length=${length}`,
  );
  return response;
};

export const getUserBoards = async (
  userId: number,
  boardType: BoardType,
  page: number,
  length: number,
) => {
  const response = await axiosInstance.get(
    `/api/users/${userId}/${boardType}/boards/?page=${page}&length=${length}`,
  );
  return response;
};

export const getAllComments = async (filterType: string, id: number) => {
  const response = await axiosInstance.get(`/api/comments/${filterType}/${id}`);
  return response;
};

export const postComment = async (
  filterType: string,
  id: number,
  content: string,
) => {
  const response = await axiosInstance.post(
    `/api/comments/${filterType}/${id}`,
    {
      content,
    },
  );
  return response;
};

export const postReply = async (
  filterType: string,
  id: number,
  commentId: number,
  content: string,
) => {
  const response = await axiosInstance.post(
    `/api/comments/${filterType}/${id}/${commentId}`,
    {
      content,
    },
  );
  return response;
};

export const deleteComment = async (commentId: number) => {
  const response = await axiosInstance.delete(`/api/comments/${commentId}`);
  return response;
};

export const getAllCategories = async () => {
  const response = await axiosInstance.get('/api/category/category-list');
  return response;
};

export const getMonthDiaryList = async (
  year: number,
  month: number,
): Promise<AxiosResponse<any, any>> => {
  const response = await axiosInstance.get(
    `/api/dream-diary/calendar/month-list/${year}/${month}`,
  );
  return response;
};

export const getDreamDiaryFeedByDate = async (
  year: number,
  month: number,
  day: number,
): Promise<AxiosResponse<any, any>> => {
  const response = await axiosInstance.get(
    `/api/dream-diary/calendar/${year}/${month + 1}/${day}`,
  );
  return response;
};

export const getCountStatByMonth = async (
  year: number,
  month: number,
): Promise<AxiosResponse<any, any>> => {
  const response = await axiosInstance.get(
    `/api/stat/categories/count/?year=${year}&month=${month}`,
  );
  return response;
};

export const getScoreStatByMonth = async (
  year: number,
  month: number,
): Promise<AxiosResponse<any, any>> => {
  const response = await axiosInstance.get(
    `/api/stat/categories/score/?year=${year}&month=${month}`,
  );
  return response;
};

export const getAverageStatByMonth = async (
  year: number,
  month: number,
): Promise<AxiosResponse<any, any>> => {
  const response = await axiosInstance.get(
    `/api/stat/average/?year=${year}&month=${month}`,
  );
  return response;
};

export const getDreamDiaryFeedList = async (
  searchType: string,
  page: number,
  length: number,
  searchKeyword: string,
) => {
  const response = await axiosInstance.get(
    `/api/dream-diary/feeds/${searchType}`,
    {
      params: {
        page,
        length,
        searchKeyword,
      },
    },
  );
  return response;
};

export const getDreamDiaryFeedPost = async (diaryId: number) => {
  const response = await axiosInstance.get(`/api/dream-diary/${diaryId}`);
  return response;
};

export const modifyDiaryPost = async (
  diaryId: number,
  title?: string,
  category?: string,
  dreamScore?: number,
  image?: Blob,
  disclosureScope?: string,
  content?: string,
) => {
  let response;
  if (image) {
    const formData = new FormData();
    formData.append('image', image);
    if (title) formData.append('title', title);
    if (category) formData.append('category', category);
    if (dreamScore) formData.append('dreamScore', dreamScore.toString());
    if (disclosureScope) formData.append('disclosureScope', disclosureScope);
    if (content) formData.append('title', content);
    response = await axiosInstance.putForm(
      `/api/dream-diary/${diaryId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response;
  } else {
    response = await axiosInstance.put(`/api/dream-diary/${diaryId}`, {
      title,
      category,
      dreamScore,
      disclosureScope,
      content,
    });
  }
  return response;
};

export const deleteDiaryPost = async (diaryId: number) => {
  const response = await axiosInstance.delete(`/api/dream-diary/${diaryId}`);
  return response;
};

export const getBoardList = async (
  post_type: BoardType,
  page: number,
  length: number,
  search_keyword: string,
  search_type: searchType,
) => {
  const response = await axiosInstance.get(
    `/api/boards/posts/${post_type}/${search_type}/list`,
    {
      params: {
        page,
        length,
        search_keyword,
      },
    },
  );
  return response;
};

export const getBoardPost = async (postId: number) => {
  const response = await axiosInstance.get(`/api/boards/posts/${postId}`);
  return response;
};
