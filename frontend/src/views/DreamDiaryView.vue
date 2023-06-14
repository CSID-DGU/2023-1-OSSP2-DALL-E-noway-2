<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useMyInfoStore } from '@/stores/my.info.store';
import '@fortawesome/fontawesome-free/css/all.css';
import {
  deleteDiaryPost,
  getDreamDiaryFeedPost,
  modifyDiaryPost,
  putInterprete,
  postDiaryLike,
  postDiaryBookmark,
  deleteDiaryBookmark,
  deleteDiaryLike,
} from '@/api/axios.custom';
import type { DiaryPost } from '@/types';
import { FilterType } from '@/types/enum/filter.type';
import dayjs from 'dayjs';

const routepp = useRoute();
const route = useRouter();
const diaryid = Number(routepp.params.diaryId);
const post = ref<DiaryPost | null>(null);
const filterType = ref(FilterType.DIARY);

onMounted(async () => {
  await useMyInfoStore().apiGetUser();
  await fetchPost(diaryid);
  await scoretostar();
});

const fetchPost = async (diaryId: number) => {
  try {
    const response = await getDreamDiaryFeedPost(diaryId);
    post.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const fetchLike = async (diaryId: number) => {
  try {
    const response = await postDiaryLike(diaryId);
  } catch (error) {
    console.error(error);
  }
};
const fetchdelLike = async (diaryId: number, filterType: FilterType) => {
  try {
    const response = await deleteDiaryLike(diaryId, filterType);
  } catch (error) {
    console.error(error);
  }
};
const fetchBm = async (diaryId: number) => {
  try {
    const response = await postDiaryBookmark(diaryId);
  } catch (error) {
    console.error(error);
  }
};
const fetchdelBm = async (diaryId: number, filterType: FilterType) => {
  try {
    const response = await deleteDiaryBookmark(diaryId, filterType);
  } catch (error) {
    console.error(error);
  }
};
const gotoComment = () => {
  route.push(`/comment/${filterType.value}/${diaryid}`);
};

const showCategoryOptions = ref(false);

const changeOptions = () => {
  showCategoryOptions.value = !showCategoryOptions.value;
};

const postModify = async (diaryId: number) => {
  try {
    const response = await modifyDiaryPost(diaryId);
    post.value = response.data;
  } catch (error) {
    console.error(error);
  }
  route.push('/dream-diary/new');
};

const postDelete = async (diaryId: number) => {
  try {
    const response = await deleteDiaryPost(diaryId, filterType.value);
    route.push('/home');
    return response;
  } catch (error) {
    console.error(error);
  }
};

const boolInterprete = ref(false);
const showInterprete = ref('');
const interprete = async (diaryid: number) => {
  try {
    const response = await putInterprete(diaryid);
    showInterprete.value = response.data.interpretation;
  } catch (error) {
    console.error(error);
  }
};

const buttonInterprete = () => {
  boolInterprete.value = !boolInterprete.value;
  interprete(diaryid);
};

const clickedlike = ref(false);
const clickLike = () => {
  if (clickedlike.value === false) {
    clickedlike.value = !clickedlike.value;
    fetchLike(diaryid);
  } else {
    clickedlike.value = !clickedlike.value;
    fetchdelLike(diaryid, filterType.value);
  }
};

const clickedbookmark = ref(false);
const clickBookmark = () => {
  if (clickedbookmark.value === false) {
    clickedbookmark.value = !clickedbookmark.value;
    fetchBm(diaryid);
  } else {
    clickedbookmark.value = !clickedbookmark.value;
    fetchdelBm(diaryid, filterType.value);
  }
};

const goProfile = () => {
  route.push(`/profile/${post.value?.user.userId}`);
};

const star = ref('');
const scoretostar = () => {
  if (post?.value) {
    if (post.value.dreamScore === 1) {
      star.value = '★☆☆☆☆';
    } else if (post.value.dreamScore === 2) {
      star.value = '★★☆☆☆';
    } else if (post.value.dreamScore === 3) {
      star.value = '★★★☆☆';
    } else if (post.value.dreamScore === 4) {
      star.value = '★★★★☆';
    } else if (post.value.dreamScore === 5) {
      star.value = '★★★★★';
    }
  }
};
</script>

<template>
  <main>
    <div class="setbut">
      <div class="select-change">
        <button @click="changeOptions" class="change-button">⁝</button>
      </div>
      <div v-if="showCategoryOptions" class="delete-modify">
        <button @click="postDelete(diaryid)" class="delete">삭제</button>
        <button @click="postModify(diaryid)" class="modify">수정</button>
      </div>
    </div>
    <div class="post">
      <div class="one-post">
        <img
          :src="post?.diaryImageUrl"
          style="
            margin: 0 auto;
            max-width: 340px;
            max-height: 240px;
            border-radius: 16px;
          "
        />
        <div class="post-box">
          <div class="post-score">{{ star }}</div>
          <div class="post-title">{{ post?.title }}</div>
          <div @click="goProfile" class="user">
            <img
              :src="post?.user.imageUrl"
              style="max-width: 20px; max-height: 20px; border-radius: 10px"
            />
            <div class="user-name">{{ post?.user.nickname }}</div>
          </div>
          <div class="post-time">
            {{ dayjs(post?.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <div class="post-view">👀 {{ post?.viewCount }}</div>
          <div class="post-content">
            <h1>{{ post?.content }}</h1>
            <button @click="buttonInterprete" class="read-dream">
              해몽보기
            </button>
            <div v-if="boolInterprete" class="interpretation">
              {{ showInterprete }}
            </div>
          </div>
        </div>
      </div>
      <div class="seticon">
        <div class="icon-row">
          <button @click="clickLike" class="click-like">
            <i class="fas fa-heart"></i>
          </button>
          <button @click="clickBookmark" class="click-bookmark">
            <i class="fas fa-bookmark"></i>
          </button>
          <button @click="gotoComment" class="go-comment">
            <i class="fas fa-comment"></i>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.post {
  width: auto;
  color: white;
}
.one-post {
  overflow-y: auto;
  scrollbar-width: thin;
  z-index: 1;
  max-height: 612px;
  border-style: solid;
  border-color: white;
  border-width: 1px 0;
  width: 80%;
  margin: 0 auto;
}
.one-post::-webkit-scrollbar {
  width: 0px;
}
.post-box {
  width: 320px;
  margin: 0 auto;
}
.post-score {
  text-align: center;
  font-size: 28px;
  color: rgb(255, 225, 0);
}
.post-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
.icon-row {
  z-index: 2;
  text-align: center;
  font-size: 20px;
}
.go-comment {
  left: 40px;
}

.go-comment i {
  color: white;
}
.go-comment:hover i {
  color: rgb(255, 225, 0); /* 마우스를 올렸을 때 아이콘의 색상 변경 */
}
.click-like {
  cursor: pointer;
}
.click-like:hover i {
  color: rgb(225, 8, 8);
}
.click-bookmark {
  left: 20px;
}
.click-bookmark:hover i {
  color: rgb(105, 85, 255);
}
.user {
  font-size: 12px;
  display: flex;
  flex-direction: row;
}
.user-name {
  left: 12px;
}
.post-time {
  font-size: 12px;
}
.post-view {
  font-size: 12px;
}
.post-content {
  min-height: auto;
}
.read-dream {
  font-size: 12px;
}
.read-dream:active {
  text-decoration: underline;
}
.interpretation {
  font-size: 12px;
}
.seticon {
  right: 20px;
}
.setbut {
  left: 340px;
}
.change-button {
  position: fixed;
  background-color: white;
  color: #000;
  width: 28px;
  height: 28px;
  z-index: 4;
  border-radius: 28px;
  bottom: 656px;
}
.delete-modify {
  position: fixed;
  font-size: 12px;
  color: black;
  display: flex;
  flex-direction: column;
  bottom: 620px;
  z-index: 4;
  width: 40px;
}
.delete {
  top: 4px;
  background-color: white;
  border-radius: 10px;
  right: 6px;
}
.modify {
  background-color: white;
  top: 8px;
  border-radius: 10px;
  right: 6px;
}
.delete:hover,
.modify:hover {
  background-color: rgb(197, 146, 255);
  font-weight: bold;
}
</style>
