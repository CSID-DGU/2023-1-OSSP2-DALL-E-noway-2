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
