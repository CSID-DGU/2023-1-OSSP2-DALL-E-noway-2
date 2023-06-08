<script setup lang="ts">
import { getProfileDetail } from '@/api/axios.custom';
import { useMyInfoStore } from '@/stores/my.info.store';
import { useProfileStore } from '@/stores/profile.store';
import { computed, onMounted, ref } from 'vue';

const { apiGetUser, getUser } = useMyInfoStore();
const { showProfileDetail, showEditedProfile, cancelEdit, updateProfile } =
  useProfileStore();

const mine = ref(getUser());
const profileDetail = ref(showProfileDetail());
const editedProfile = ref(showEditedProfile());

// Profile Edit Modal
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
    await apiGetUser();
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
  <div class="modal">
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
/* Profile Edit Modal Styles */
h1,
h2,
label {
  @apply text-lg font-bold text-white;
}

img {
  @apply w-20 h-20 rounded-full;
}

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
