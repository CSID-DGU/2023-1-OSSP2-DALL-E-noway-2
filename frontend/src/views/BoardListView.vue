<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { ref } from 'vue';

const posts = ref([
  // 게시글 데이터 (가상 데이터로 대체)
  {
    id: 1,
    title: '게시글 제목 1',
    user: '사용자1',
    content: '내용이긴글1',
    image: '/path/to/image1.jpg',
    views: 10,
  },
  {
    id: 2,
    title: '게시글 제목 2',
    user: '사용자2',
    content: '내용이긴글2',
    image: '/path/to/image2.jpg',
    views: 32,
  },
  {
    id: 3,
    title: '게시글 제목 3',
    user: '사용자3',
    content: '내용이긴글3달리노웨이이거작동하나요제발',
    image: '/path/to/image3.jpg',
    views: 2,
  },
  {
    id: 4,
    title: '게시글 제목 4',
    user: '사용자4',
    content: '내용이긴글4',
    image: '/path/to/image4.jpg',
    views: 13,
  },
  {
    id: 5,
    title: '게시글 제목 5',
    user: '사용자5',
    content: '내용이긴글5',
    image: '/path/to/image5.jpg',
    views: 7,
  },
  {
    id: 6,
    title: '게시글 제목 6',
    user: '사용자6',
    content: '내용이긴글6',
    image: '/path/to/image6.jpg',
    views: 7,
  },
  {
    id: 7,
    title: '게시글 제목 7',
    user: '사용자7',
    content: '내용이긴글7',
    image: '/path/to/image7.jpg',
    views: 2,
  },
]);
</script>

<template>
  <main>
    <h1>Board</h1>
    <div class="search-bar"></div>
    <div class="scroll-container">
      <RouterLink to="/post/1">
        <div class="post-container">
          <div v-for="post in posts" :key="post.id" class="post">
            <div class="text-color">
              <h2 class="post-title">{{ post.title }}</h2>
              <p class="post-user">{{ post.user }}</p>
              <div class="post-content">
                <div class="post-content-left">
                  <p>{{ post.views }}</p>
                </div>
                <div class="post-content-right">
                  <img :src="post.image" alt="Post Image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.search-bar {
  height: 40px;
  width: 320px;
  background-color: white;
  @apply inset-x-8;
  padding: 8px;
  border-radius: 28px;
}
.scroll-container {
  max-height: 570px;
  overflow-y: auto;
  scrollbar-width: thin;
}
.scroll-container::-webkit-scrollbar {
  width: 8px; /* 스크롤바 너비 설정 */
}
.scroll-container::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 4px;
}
.post-container {
  width: 100%;
  padding: 32px;
  background-color: transparent;
  max-height: 100%;
}
.text-color {
  color: white;
}
.post {
  margin-bottom: 0px;
  padding: 12px;
  border-style: solid;
  border-color: white;
  border-width: 1px 0;
}
.post-content {
  display: flex;
  flex-direction: row;
  align-items: center;
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
