import type { BoardType } from '@/types/enum/board.type';
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

export const getAllCategories = async () => {
  const response = await axiosInstance.get('/api/category/category-list');
  return response;
};
