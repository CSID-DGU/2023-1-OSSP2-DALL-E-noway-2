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
const handleScroll = () => {
  // 스크롤 이벤트 핸들러
  // 스크롤이 끝에 도달하면 추가적인 데이터 로드 등의 작업을 수행할 수 있음
};
</script>

<template>
  <main>
    <h1>Board</h1>
    <div class="search-bar"></div>
    <div class="feed-list">
      <div class="feed-container" @scroll="handleScroll">
        <div v-for="post in posts" :key="post.id" class="post">
          <div class="text-color">
            <RouterLink to="/post/1">
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
            </RouterLink>
          </div>
        </div>
      </div>
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
.feed-list {
  height: 80vh;
  overflow-y: scroll;
}
.feed-container {
  width: 100%;
  padding: 32px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: transparent;
}
.text-color {
  color: white;
}
.post {
  margin-bottom: 0px;
  padding: 12px;
  border: 1px solid white;
  background-color: transparent;
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
