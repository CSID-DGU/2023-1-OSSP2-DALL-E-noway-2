<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { getProfile } from '@/api/axios.custom';
import type { Profile } from '@/types';
import { useProfileStore } from '@/stores/profile.store';
import { useMyInfoStore } from '@/stores/my.info.store';
import router from '@/router';
import { FollowType } from '@/types/enum/follow.type';

const props = defineProps<{ userId: number }>();

const profile: Ref<Profile> = ref({
  user: {
    userId: 0,
    nickname: '',
    imageUrl: '',
  },
  followerCount: 0,
  followingCount: 0,
  dreamDiaryCount: 0,
});

const { getUser, apiGetUser } = useMyInfoStore();

const user = ref(getUser());

const goProfileDetail = () => {
  router.push({ name: 'profile-detail' });
};

const goFollowView = (followType: FollowType) => {
  router.push({ name: 'follow', params: { userId: props.userId, followType } });
};

onMounted(async () => {
  try {
    await apiGetUser();
    user.value = getUser();
    const response = await getProfile(props.userId);
    if (response.status === 200) {
      profile.value = response.data;
      useProfileStore().setProfile(profile.value);
    } else {
      console.log(response);
    }
  } catch (error) {
    console.log(error);
    router.push({ name: 'not-found' });
  }
});
</script>

<template>
  <div class="wrap">
    <div class="nickname-bar">
      <h1>{{ profile.user.nickname }}</h1>
    </div>
    <div class="row-group">
      <div class="row-item">
        <div class="profile-image-container">
          <img
            class="profile-image"
            :src="profile.user.imageUrl"
            alt="profile image"
          />
        </div>
      </div>

      <div class="row-item" style="flex: 1" v-if="user.userId === props.userId">
        <div class="col-group" @click="goProfileDetail()">
          <div class="col-item"><h1>프로필 상세</h1></div>
        </div>
      </div>

      <div class="row-item">
        <div class="col-group" @click="goFollowView(FollowType.FOLLOWER)">
          <div class="col-item">{{ profile.followerCount }}</div>
          <div class="col-item">Followers</div>
        </div>
      </div>

      <div class="row-item">
        <div class="col-group" @click="goFollowView(FollowType.FOLLOWING)">
          <div class="col-item">{{ profile.followingCount }}</div>
          <div class="col-item">Followings</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  @apply w-full flex flex-col justify-center h-full z-[1] bg-black;
}

.nickname-bar {
  @apply text-center text-white;
}

.row-group {
  @apply flex flex-row;
}

.row-item {
  @apply m-0.5;
}
.row-item:nth-child(1) {
  flex: 2;
}

.row-item:nth-child(2) {
  flex: 3;
}

.row-item:nth-child(3) {
  flex: 3;
}

.col-group {
  @apply flex flex-col;
}

.col-item {
  @apply m-0.5 text-center text-white;
}

.profile-image-container {
  @apply flex items-center justify-center rounded-full overflow-hidden;
  /* 이미지를 둥글게 만들기 위해 rounded-full 클래스를 추가하였습니다. */
  /* 이미지를 div 내에서 가운데에 정렬하기 위해 flex 및 items-center, justify-center 클래스를 추가하였습니다. */
  /* overflow-hidden 클래스를 추가하여 이미지를 컨테이너 내에서 넘치는 부분은 숨깁니다. */
}

.profile-image {
  /* 이미지를 컨테이너에 꽉 차도록 설정합니다. */
  @apply w-16 h-16 object-cover rounded-full;
}

.follw-group {
  @apply mr-1;
}
</style>
