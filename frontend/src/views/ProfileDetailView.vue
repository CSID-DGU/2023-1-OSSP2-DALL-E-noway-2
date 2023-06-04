<script setup lang="ts">
import { getProfileDetail } from '@/api/axios.custom';
import { getCookie, removeCookie } from '@/api/cookie';
import router from '@/router';
import { useMyInfoStore } from '@/stores/my.info.store';
import { computed, onMounted, ref, type Ref } from 'vue';
import IconCoin from '@/components/icons/IconCoin.vue';
import { updateProfileRequest } from '@/api/axios.custom';

const { getUser } = useMyInfoStore();
const mine = ref(getUser());
const editing = ref(false);

interface ProfileDetail {
  userId: number;
  username: string;
  email: string;
  nickname: string;
  imageUrl: string;
  presentation: string;
  credits: number;
  followerCount: number;
  followingCount: number;
}

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

interface EditedProfile {
  image: Blob;
  nickname: string;
  presentation: string;
}

const editedProfile: Ref<EditedProfile> = ref({
  image: new Blob(),
  nickname: '',
  presentation: '',
});

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
      if (editedProfile.value.image)
        profileDetail.value.imageUrl = response.data.imageUrl;
      if (editedProfile.value.nickname)
        profileDetail.value.nickname = response.data.nickname;
      if (editedProfile.value.presentation)
        profileDetail.value.presentation = response.data.presentation;

      editing.value = false;
    } else {
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
};

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

// Profile Edit Modal
const showModal = ref(false);

const fileInput = ref<HTMLElement | null>(null);

const onInputImage = (event: any) => {
  editedProfile.value.image = event.target.files[0] as Blob;
};

const handleUploadClick = () => {
  fileInput.value?.click();
};

const getUploadedImageUrl = computed(() => {
  return editedProfile.value.image
    ? URL.createObjectURL(editedProfile.value.image)
    : profileDetail.value.imageUrl;
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
  <!-- Profile Edit Modal -->
  <div v-if="editing" class="modal">
    <div class="modal-content">
      <h2>프로필 편집</h2>
      <div class="form-group" @click="handleUploadClick">
        <label for="nickname">프로필 이미지</label>
        <img
          class="uploaded-image"
          :src="getUploadedImageUrl"
          v-if="editedProfile.image.size > 0"
          alt="Uploaded Image"
        />
        <img
          class="current-image"
          :src="profileDetail.imageUrl"
          v-else
          alt="Current Image"
        />
        <input
          type="file"
          ref="fileInput"
          id="profile-image"
          visibility="hidden"
          @change="onInputImage"
          accept="image/*"
          style="display: none"
        />
      </div>
      <div class="form-group">
        <label for="nickname">닉네임</label>
        <input type="text" id="nickname" v-model="editedProfile.nickname" />
      </div>
      <div class="form-group">
        <label for="presentation">자기소개</label>
        <textarea
          id="presentation"
          v-model="editedProfile.presentation"
        ></textarea>
      </div>
      <div class="form-actions">
        <button @click="cancelEdit">취소</button>
        <button @click="updateProfile">저장</button>
      </div>
    </div>
  </div>
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

/* Profile Edit Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.modal-content {
  background-color: #242424;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 500px;
}

.modal-content h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group input[type='text'],
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #242424;
  border-radius: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.form-actions button {
  padding: 0.5rem 1rem;
  background-color: black;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin: 0 0.25rem;
}
</style>
