import { updateProfileRequest } from '@/api/axios.custom';
import type { EditedProfile, Profile, ProfileDetail } from '@/types';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useProfileStore = defineStore('profile', () => {
  // 프로필 헤더바

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

  const showProfile = () => {
    return profile.value;
  };

  const setProfile = (newProfile: Profile) => {
    profile.value = newProfile;
  };

  // 프로필 상세

  const profileDetail: Ref<ProfileDetail> = ref({
    userId: 0,
    username: '',
    email: '',
    nickname: '',
    imageUrl: '',
    presentation: '',
    credits: 0,
    followerCount: 0,
    followingCount: 0,
  });

  const setProfileDetail = (newProfileDetail: ProfileDetail) => {
    profileDetail.value = newProfileDetail;
  };

  const showProfileDetail = () => {
    return profileDetail.value;
  };

  // 프로필 편집

  const editing = ref(false);

  const isEditing = () => {
    return editing.value;
  };

  const setEditing = (newEditing: boolean) => {
    editing.value = newEditing;
  };

  const editedProfile: Ref<EditedProfile> = ref({
    image: new Blob(),
    nickname: '',
    presentation: '',
  });

  const setEditedProfile = (newEditedProfile: EditedProfile) => {
    editedProfile.value = newEditedProfile;
  };

  const showEditedProfile = () => {
    return editedProfile.value;
  };

  const goEditProfile = () => {
    editing.value = true;
    // Pre-fill the form with current profile details
    editedProfile.value.nickname = profileDetail.value.nickname;
    editedProfile.value.presentation = profileDetail.value.presentation;
  };

  const cancelEdit = () => {
    editing.value = false;
  };

  const updateProfile = async () => {
    try {
      const response = await updateProfileRequest(
        editedProfile.value.image,
        editedProfile.value.nickname,
        editedProfile.value.presentation,
      );
      if (response.status === 200) {
        console.log('edit');
        profileDetail.value = response.data;
        editing.value = false;
        console.log(editing.value);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    profile,
    setUserId,
    setNickname,
    setProfileImageUrl,
    setFollowerCount,
    setFollowingCount,
    showProfile,
    setProfile,
    setProfileDetail,
    showProfileDetail,
    setEditing,
    isEditing,
    setEditedProfile,
    showEditedProfile,
    cancelEdit,
    updateProfile,
    goEditProfile,
  };
});
