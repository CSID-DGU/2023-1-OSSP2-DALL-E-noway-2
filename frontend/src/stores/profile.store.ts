import type { Profile } from '@/types';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useProfileStore = defineStore('profile', () => {
  const profile: Ref<Profile> = ref({
    user: {
      userId: 9,
      nickname: '',
      imageUrl: '',
    },
    followerCount: 0,
    followingCount: 0,
  });

  const setUserId = (userId: number) => {
    profile.value.user.userId = userId;
  };

  const setNickname = (nickname: string) => {
    profile.value.user.nickname = nickname;
  };

  const setProfileImageUrl = (imageUrl: string) => {
    profile.value.user.imageUrl = imageUrl;
  };

  const setFollowerCount = (followerCount: number) => {
    profile.value.followerCount = followerCount;
  };

  const setFollowingCount = (followingCount: number) => {
    profile.value.followingCount = followingCount;
  };

  const getProfile = () => {
    return profile.value;
  };

  const setProfile = (newProfile: Profile) => {
    profile.value = newProfile;
  };

  return {
    profile,
    setUserId,
    setNickname,
    setProfileImageUrl,
    setFollowerCount,
    setFollowingCount,
    getProfile,
    setProfile,
  };
});
