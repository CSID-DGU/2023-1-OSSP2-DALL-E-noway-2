<!-- <script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted, type Ref } from 'vue';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import { getDreamDiaryFeedPost } from '@/api/axios.custom';
import type { DiaryFeed } from '@/types';

const post: Ref<DiaryFeed> = ref();

const fetchData = async () => {
  try {
    const response = await getDreamDiaryFeedPost(post.diaryId);
    // 가져온 데이터 처리
  } catch (error) {
    console.error(error); // 오류 처리
  }
};

onMounted(fetchData);

const route = useRouter();

const gotoComment = () => {
  route.push('/comment');
};

const showCategoryOptions = ref(false);

const changeOptions = () => {
  showCategoryOptions.value = !showCategoryOptions.value;
};

const postModify = () => {
  route.push('/dream-diary/new');
};

const postDelete = () => {
  route.push('/home');
};

const showInterprete = ref(false);
const buttonInterprete = () => {
  showInterprete.value = !showInterprete.value;
};

const clickLike = () => {
  DiaryFeedList.setLike(post.likes + 1);
};

const clickBookmark = () => {
  DiaryFeedList.setBookmark(post.bookmarks + 1);
};
</script>
<template>
  <main>
    <div class="one-post">
      <img
        :src="post.image"
        style="
          margin: 0 auto;
          max-width: 340px;
          max-height: 240px;
          border-radius: 16px;
        "
      />
      <div class="post-box">
        <div class="post-score">{{ post.Dreamscore }}</div>
        <div class="post-title">{{ post.title }}</div>
        <div class="list-row">
          <div class="row-left">
            {{ post.nickname }}
          </div>
          <div class="row-middle">
            {{ post.createdAt }}
          </div>
          <duv class="row-right"> 👀 {{ post.viewCount }} </duv>
        </div>
        <div class="post-content">
          <h1>{{ post.content }}</h1>
          <div class="post-tag">{{ post.tags }}</div>
          <button @click="buttonInterprete" class="read-dream">해몽보기</button>
          <div v-if="showInterprete" class="interpretation">
            {{ post.interpretation }}
          </div>
          <div class="icon-row">
            <button @click="clickLike" class="click-like">
              <i class="fas fa-heart"> {{ post.likes }}</i>
            </button>
            <button @click="clickBookmark" class="click-bookmark">
              <i class="fas fa-bookmark"> {{ post.bookmarks }}</i>
            </button>
            <button @click="gotoComment" class="go-comment">
              <i class="fas fa-comment"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="select-change">
      <button @click="changeOptions" class="change-button">⁝</button>
    </div>
    <div v-if="showCategoryOptions" class="delete-modify">
      <button @click="postDelete()" class="delete">삭제</button>
      <button @click="postModify()" class="modify">수정</button>
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
  max-height: 634px;
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
  font-size: 24px;
}
.post-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
.icon-row {
  top: 36px;
  z-index: 2;
}

.go-comment {
  left: 224px;
}

.go-comment i {
  color: white;
  font-size: 20px;
}
.go-comment:hover i {
  color: magenta; /* 마우스를 올렸을 때 아이콘의 색상 변경 */
}
.click-like {
  cursor: pointer;
}
.click-like i {
  font-size: 20px;
}
.click-bookmark {
  left: 20px;
}
.click-bookmark i {
  font-size: 20px;
  transition: red;
}
.list-row {
  display: flex;
  flex-direction: row;
  font-size: 12px;
}
.row-middle {
  left: 16px;
}
.row-right {
  left: 156px;
}
.post-content {
  min-height: auto;
}
.post-tag {
  top: 8px;
  font-size: 12px;
}
.read-dream {
  font-size: 12px;
  top: 16px;
}
.read-dream:active {
  text-decoration: underline;
}
.interpretation {
  font-size: 12px;
  top: 16px;
}
.change-button {
  background-color: white;
  color: #000;
  width: 28px;
  height: 28px;
  z-index: 4;
  border-radius: 28px;
  left: 374px;
  bottom: 636px;
}
.delete-modify {
  font-size: 12px;
  color: black;
  display: flex;
  flex-direction: column;
  left: 368px;
  bottom: 636px;
  z-index: 4;
  width: 40px;
}
.delete {
  top: 4px;
  background-color: white;
  border-radius: 10px;
}
.modify {
  background-color: white;
  top: 8px;
  border-radius: 10px;
}
</style> -->

<script setup lang="ts">
import { ref } from 'vue';
</script>

<template>
  <div></div>
</template>

<style scoped></style>
