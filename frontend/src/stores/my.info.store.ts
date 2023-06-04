import { getMyInfo } from '@/api/axios.custom';
import type { User } from '@/types';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useMyInfoStore = defineStore('my-info', () => {
  const user: Ref<User> = ref({
    userId: 0,
    nickname: '',
    imageUrl: '',
  });

  const setUserId = (userId: number) => {
    user.value.userId = userId;
  };

  const setNickname = (nickname: string) => {
    user.value.nickname = nickname;
  };

  const setProfileImageUrl = (imageUrl: string) => {
    user.value.imageUrl = imageUrl;
  };

  const getUser = () => {
    return user.value;
  };

  const setUser = (newUser: User) => {
    user.value = newUser;
  };

  const apiGetUser = async () => {
    try {
      const response = await getMyInfo();
      if (response.status === 200) {
        useMyInfoStore().setUser(response.data);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    user,
    setUserId,
    setNickname,
    setProfileImageUrl,
    getUser,
    setUser,
    apiGetUser,
  };
});
