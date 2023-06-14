<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import '@fortawesome/fontawesome-free/css/all.css';
import { ref, onMounted } from 'vue';
import { useMyInfoStore } from '@/stores/my.info.store';
import type { BoardPost } from '@/types';
import {
  getBoardPost,
  deleteBoardBookmark,
  deleteBoardLike,
  postBoardBookmark,
  postBoardLike,
  modifyBoardPost,
  deleteBoardPost,
} from '@/api/axios.custom';
import { BoardType } from '@/types/enum/board.type';
import dayjs from 'dayjs';

const post = ref<BoardPost>();
const routepp = useRoute();
const route = useRouter();
const postid = Number(routepp.params.postId);
const showCategoryOptions = ref(false);
const filterType = ref(BoardType.FREE);

const fetchPost = async (postid: number) => {
  try {
    const response = await getBoardPost(postid);
    post.value = response.data;
    filterType.value = response.data.boardType;
  } catch (error) {
    console.error(error);
  }
};
const fetchLike = async (postid: number, filterType: BoardType) => {
  try {
    await postBoardLike(postid, filterType);
  } catch (error) {
    console.error(error);
  }
};
const fetchdelLike = async (postid: number, filterType: BoardType) => {
  try {
    await deleteBoardLike(postid, filterType);
  } catch (error) {
    console.error(error);
  }
};
const fetchBm = async (postid: number, filterType: BoardType) => {
  try {
    await postBoardBookmark(postid, filterType);
  } catch (error) {
    console.error(error);
  }
};
const fetchdelBm = async (postid: number, filterType: BoardType) => {
  try {
    await deleteBoardBookmark(postid, filterType);
  } catch (error) {
    console.error(error);
  }
};
onMounted(async () => {
  await useMyInfoStore().apiGetUser();
  await fetchPost(postid);
});

const gotoComment = () => {
  route.push(`/comment/${filterType.value}/${postid}`);
};

const changeOptions = () => {
  showCategoryOptions.value = !showCategoryOptions.value;
};

const checkUpdate = () => {
  let date = post.value?.createdAt;
  if (post.value?.updatedAt === null) {
    return date;
  } else {
    date = post.value?.updatedAt;
    return date;
  }
};

const postModify = async (postid: number) => {
  try {
    const response = await modifyBoardPost(postid);
    post.value = response.data;
  } catch (error) {
    console.error(error);
  }
  route.push('/post/new');
};

const postDelete = async (postid: number) => {
  try {
    const response = await deleteBoardPost(postid, filterType.value);
    route.push('/board-list');
    return response;
  } catch (error) {
    console.error(error);
  }
};

const clickedlike = ref(false);
const clickLike = () => {
  if (clickedlike.value === false) {
    clickedlike.value = !clickedlike.value;
    fetchLike(postid, filterType.value);
  } else {
    clickedlike.value = !clickedlike.value;
    fetchdelLike(postid, filterType.value);
  }
};

const clickedbookmark = ref(false);
const clickBookmark = () => {
  if (clickedbookmark.value === false) {
    clickedbookmark.value = !clickedbookmark.value;
    fetchBm(postid, filterType.value);
  } else {
    clickedbookmark.value = !clickedbookmark.value;
    fetchdelBm(postid, filterType.value);
  }
};

const goProfile = () => {
  route.push(`/profile/${post.value?.author.userId}`);
};
</script>
<template>
  <main>
    <div class="setbut">
      <div class="select-change">
        <button @click="changeOptions" class="change-button">⁝</button>
      </div>
      <div v-if="showCategoryOptions" class="delete-modify">
        <button @click="postDelete(postid)" class="delete">삭제</button>
        <button @click="postModify(postid)" class="modify">수정</button>
      </div>
    </div>
    <div class="post">
      <div class="one-post">
        <img
          :src="post?.image"
          style="
            margin: 0 auto;
            max-width: 340px;
            max-height: 240px;
            border-radius: 16px;
          "
        />
        <div class="post-box">
          <div class="post-title">{{ post?.title }}</div>
          <div @click="goProfile" class="user">
            <img
              :src="post?.author.imageUrl"
              style="max-width: 20px; max-height: 20px; border-radius: 10px"
            />
            <div class="user-name">{{ post?.author.nickname }}</div>
          </div>
          <div class="post-date">
            {{ dayjs(checkUpdate()).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <div class="post-view">👀 {{ post?.viewCount }}</div>
          <div class="post-content">
            <h1>{{ post?.content }}</h1>
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
.one-post {
  overflow-y: auto;
  scrollbar-width: thin;
  z-index: 1;
  max-height: 600px;
}
.one-post::-webkit-scrollbar {
  width: 0px;
}
.post-box {
  width: 320px;
  margin: 0 auto;
  color: white;
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
  color: rgb(255, 225, 0);
}
.click-like {
  cursor: pointer;
}
.click-like i {
  font-size: 20px;
}
.click-like:hover i {
  color: rgb(253, 80, 80);
}
.click-bookmark {
  left: 20px;
}
.click-bookmark i {
  font-size: 20px;
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
.post-date {
  font-size: 12px;
}
.post-view {
  font-size: 12px;
}
.post-content {
  min-height: auto;
}
.seticon {
  right: 20px;
  color: white;
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
