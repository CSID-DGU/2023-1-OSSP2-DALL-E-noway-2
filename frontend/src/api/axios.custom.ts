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
