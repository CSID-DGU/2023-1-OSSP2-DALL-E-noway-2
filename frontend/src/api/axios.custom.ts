import type { AxiosResponse } from 'axios';
import { axiosInstance } from './axios.instance';

const postDreamDiaryURL = '/api/dream-diary';
export const postDreamDiary = async (dreamDiaryCreateRequest: FormData) => {
  const response = await axiosInstance.postForm(
    postDreamDiaryURL,
    dreamDiaryCreateRequest,
  );
  return response;
};

const postDreamImageUrl = '/api/dream-diary/dream-images';
export const postDreamImage = async (title: string, content: string) => {
  const response = await axiosInstance.post(postDreamImageUrl, {
    title,
    content,
  });
  return response;
};

const getCreditInfoUrl = '/api/users/credit-info';
export const getCreditInfo = async () => {
  const response = await axiosInstance.get(getCreditInfoUrl);
  return response;
};

const postNewPostUrl = '/api/boards/posts';
export const postNewPost = async (newPostRequest: FormData) => {
  const response = await axiosInstance.postForm(postNewPostUrl, newPostRequest);
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
  const response = await axiosInstance.delete(
    // FIXME: API 엔드포인트 수정 필요
    `/api/comments/test/1/${commentId}`,
  );
  return response;
};

export const getMonthDiaryList = async (
  year: number,
  month: number,
): Promise<AxiosResponse<any, any>> => {
  // const response = await axiosInstance.get(
  //   `/api/dream-diary/calendar/${year}/${month}`,
  // );
  // return response;

  let response = {} as AxiosResponse<any, any>;
  response.data = {
    year: 2023,
    month: 6,
    days: [
      {
        day: 1,
        diaryId: null,
        dreamScore: 0,
      },
      {
        day: 2,
        diaryId: null,
        dreamScore: 0,
      },
      {
        day: 3,
        diaryId: 1,
        dreamScore: 1,
      },
      {
        day: 4,
        diaryId: null,
        dreamScore: 0,
      },
      {
        day: 5,
        diaryId: 2,
        dreamScore: 2,
      },
      {
        day: 6,
        diaryId: null,
        dreamScore: 0,
      },
      {
        day: 7,
        diaryId: 3,
        dreamScore: 3,
      },
      {
        day: 8,
        diaryId: null,
        dreamScore: 0,
      },
      {
        day: 9,
        diaryId: 4,
        dreamScore: 4,
      },
      {
        day: 10,
        diaryId: null,
        dreamScore: 0,
      },
      {
        day: 11,
        diaryId: 5,
        dreamScore: 5,
      },
      {
        day: 12,
        diaryId: null,
        dreamScore: 0,
      },
    ],
  };

  for (let i = 13; i <= 31; i++) {
    response.data.days.push({
      day: i,
      diaryId: null,
      dreamScore: 0,
    });
  }
  return response;
};
