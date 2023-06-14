<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref, onMounted } from 'vue';
import type { BoardList, DiaryFeed } from '@/types';
import { getDiaryBookmark, getBoardBookmark } from '@/api/axios.custom';
import { FilterType } from '@/types/enum/filter.type';

const dposts = ref<DiaryFeed[]>([]);
const bposts = ref<BoardList[]>([]);
const arrlength = ref(100);

const showdiary = async (page: number, length: number) => {
  try {
    page = 1;
    const response = await getDiaryBookmark(page, length);
    arrlength.value = response.data.totalLength;
    dposts.value = response.data.dreamDiaryFeeds;
    post_type.value = FilterType.DIARY;
  } catch (error) {
    console.error(error);
  }
};

const post_type = ref<FilterType>(FilterType.DIARY);
const showboard = async (
  posttype: FilterType,
  page: number,
  length: number,
) => {
  try {
    page = 1;
    posttype = post_type.value;
    const response = await getBoardBookmark(posttype, page, length);
    arrlength.value = response.data.totalLength;
    bposts.value = response.data.boardFeeds;
  } catch (error) {
    console.error(error);
  }
};
const category = ref('');
const selectCategory = async (cate: string) => {
  category.value = cate;
  if (cate === '자유') {
    post_type.value = FilterType.FREE;
    await showboard(post_type.value, 1, arrlength.value);
    await showboard(post_type.value, 1, arrlength.value);
  } else if (cate === '수면팁') {
    post_type.value = FilterType.TIP;
    await showboard(post_type.value, 1, arrlength.value);
    await showboard(post_type.value, 1, arrlength.value);
  } else if (cate === '해몽의뢰') {
    post_type.value = FilterType.REQUEST;
    await showboard(post_type.value, 1, arrlength.value);
    await showboard(post_type.value, 1, arrlength.value);
  } else if (cate === '꿈일기목록') {
    post_type.value = FilterType.DIARY;
    await showdiary(1, arrlength.value);
    await showdiary(1, arrlength.value);
  }
};

const truncateContent = (content: string, maxLength: number) => {
  if (content.length <= maxLength) {
    return content;
  } else {
    return content.slice(0, maxLength) + '...';
  }
};

onMounted(async () => {
  await showdiary(1, arrlength.value);
  await selectCategory('꿈일기목록');
});
</script>

<template>
  <main>
    <div class="like-category">
      <div class="pageinfo">즐겨찾기 목록</div>
      <div class="select-like-cate">
        <button @click="selectCategory('꿈일기목록')" class="like-dream-diary">
          꿈일기목록
        </button>
        <button @click="selectCategory('자유')" class="like-free">자유</button>
        <button @click="selectCategory('수면팁')" class="like-sleep">
          수면 팁
        </button>
        <button @click="selectCategory('해몽의뢰')" class="like-read-dream">
          해몽 의뢰
        </button>
      </div>
    </div>
    <div class="like-list">
      <template v-if="category === '꿈일기목록'">
        <div class="scroll-container">
          <div>
            <DreamDiaryView :posts="dposts" />
            <div v-for="post in dposts" :key="post.diaryId" class="feed">
              <RouterLink :to="`/dream-diary/${post.diaryId}`">
                <div class="feed-container">
                  <h2 class="feed-title">{{ post.title }}</h2>
                  <p class="feed-user">{{ post.nickname }}</p>
                  <p class="feed-content">
                    {{ truncateContent(post.content, 25) }}
                  </p>
                  <img
                    :src="post.imageUrl"
                    alt="Post Image"
                    style="
                      margin: 0 auto;
                      max-width: 260px;
                      max-height: auto;
                      top: 12px;
                      border-radius: 16px;
                    "
                  />
                  <div class="feed-view">
                    <p>👀 {{ post.viewCount }}</p>
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="scroll-container">
          <div v-for="post in bposts" :key="post.postId" class="post">
            <RouterLink :to="`/board/${post.postId}`">
              <div class="post-content">
                <div class="post-content-left">
                  <h2 class="post-title">{{ post.title }}</h2>
                  <p class="post-user">{{ post.nickname }}</p>
                  <p>👀 {{ post.viewCount }}</p>
                </div>
                <div class="post-content-right">
                  <img
                    :src="post.imageUrl"
                    alt="Post Image"
                    style="max-width: 84px; height: 60px; border-radius: 8px"
                  />
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<style scoped>
.like-category {
  width: 360px;
  background-color: #333;
  margin: 0 auto;
  text-align: center;
  height: 32px;
  border-radius: 16px;
  top: 24px;
  z-index: 1;
  color: white;
}
.pageinfo {
  bottom: 28px;
  font-weight: bold;
}
.select-like-cate {
  font-size: 12px;
  top: 1px;
}
.like-dream-diary {
  width: 92px;
  background-color: #666;
  border-radius: 10px;
  right: 18px;
  bottom: 17px;
}
.like-free {
  width: 52px;
  right: 6px;
  background-color: #666;
  border-radius: 10px;
  bottom: 17px;
}
.like-sleep {
  left: 6px;
  width: 60px;
  background-color: #666;
  border-radius: 10px;
  bottom: 17px;
}
.like-read-dream {
  width: 80px;
  left: 18px;
  background-color: #666;
  border-radius: 10px;
  bottom: 17px;
}
.like-dream-diary:hover,
.like-free:hover,
.like-sleep:hover,
.like-read-dream:hover {
  background-color: rgb(197, 146, 255);
  font-weight: bold;
}
.scroll-container {
  height: 568px;
  overflow-y: auto;
  scrollbar-width: thin;
  top: 36px;
  z-index: 1;
}
.scroll-container::-webkit-scrollbar {
  width: 8px;
}
.scroll-container::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 4px;
}
.feed {
  width: 84%;
  padding: 20px;
  margin: 0 auto;
  border-color: white;
  border-width: 1px 0;
  color: white;
}
.feed-container {
  bottom: 8px;
  font-size: 12px;
}
.feed-title {
  font-size: 20px;
  font-weight: bold;
}
.feed-view {
  top: 20px;
}
.post {
  padding: 12px;
  border-style: solid;
  border-color: white;
  border-width: 1px 0;
  color: white;
  width: 84%;
  margin: 0 auto;
}
.post-content {
  display: flex;
  flex-direction: row;
}
.post-content-left {
  margin-right: 10px;
  font-size: 12px;
}
.post-content-right {
  margin-left: auto;
}
.post-title {
  font-size: 16px;
}
.post-user {
  font-size: 12px;
}
</style>
