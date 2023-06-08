<script setup lang="ts">
import { getProfileDetail } from '@/api/axios.custom';
import { removeCookie } from '@/api/cookie';
import router from '@/router';
import { useMyInfoStore } from '@/stores/my.info.store';
import { onMounted, ref, watch } from 'vue';
import IconCoin from '@/components/icons/IconCoin.vue';
import ProfileEdit from '@/components/profile/ProfileEdit.vue';
import { useProfileStore } from '@/stores/profile.store';

const { getUser } = useMyInfoStore();
const { goEditProfile, isEditing, showProfileDetail } = useProfileStore();

const mine = ref(getUser());
const editing = ref(isEditing());
const profileDetail = ref(showProfileDetail());

const goLikeView = () => {
  router.push({ name: 'like' });
};

const goBookmarkView = () => {
  router.push({ name: 'bookmark' });
};

const logout = () => {
  removeCookie();
  location.href = '/';
};

watch(isEditing, (value) => {
  editing.value = value;
});

watch(showProfileDetail, (value) => {
  profileDetail.value = value;
  console.log(profileDetail.value);
});

onMounted(async () => {
  try {
    await useMyInfoStore().apiGetUser();
    mine.value = getUser();
    const response = await getProfileDetail(mine.value.userId);
    if (response.status === 200) {
      profileDetail.value = response.data;
    } else {
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="wrap">
    <div class="profile-info" @click="goEditProfile">
      <div class="user-image">
        <img :src="profileDetail.imageUrl" alt="user-image" />
      </div>
      <div class="profile-edit">
        <h1>프로필 편집</h1>
      </div>
    </div>
    <div class="user-info">
      <div class="user-email">
        <h1>{{ profileDetail.email }}</h1>
      </div>
      <div class="user-username">
        <h1>{{ profileDetail.username }}</h1>
      </div>
      <div class="user-nickname">
        <h1>{{ profileDetail.nickname }}</h1>
      </div>
      <div class="user-presentation">
        <h1>{{ profileDetail.presentation }}</h1>
      </div>
      <div class="user-credits">
        <div class="flex flex-row">
          <div class="m-0.5">
            <IconCoin />
          </div>
          <div class="m-0.5">
            <h1>{{ profileDetail.credits }}</h1>
          </div>
        </div>
      </div>
    </div>
    <div class="util-info">
      <div class="like-bookmark" @click="goLikeView">
        <h1>좋아요 목록 보러가기</h1>
      </div>
      <div class="like-bookmark" @click="goBookmarkView">
        <h1>북마크 목록 보러가기</h1>
      </div>
      <div class="logout" @click="logout">
        <h1>로그아웃</h1>
      </div>
      <div class="unregister">
        <!-- FIXME: 추후 API가 구현되면 추가 필요 -->
        <h1>회원탈퇴</h1>
      </div>
    </div>
  </div>
  <ProfileEdit v-if="editing" />
</template>

<style scoped>
.wrap {
  @apply w-full flex flex-col justify-center h-full z-[1];
  @apply text-white;
  @apply items-center;
}

.profile-info {
  @apply flex flex-col items-center m-4;
}

.user-image {
  @apply w-24 h-24 rounded-full overflow-hidden m-2;
}

.user-image img {
  @apply w-full h-full object-cover;
}
.form-group img {
  @apply w-16 h-16 rounded-full overflow-hidden m-2;
}

.user-info {
  @apply flex flex-col items-center m-4;
}

.user-info > div {
  @apply w-full flex flex-col items-center m-2;
}

.util-info {
  @apply flex flex-col items-center m-4;
}

.util-info > div {
  @apply w-full flex flex-col items-center m-2;
}

h1,
h2,
label {
  @apply text-lg font-bold text-white;
}
</style>
