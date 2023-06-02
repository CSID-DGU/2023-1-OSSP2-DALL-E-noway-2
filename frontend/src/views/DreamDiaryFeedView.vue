<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useMyInfoStore } from '@/stores/my.info.store';

const posts = ref([
  // 게시글 데이터 (가상 데이터로 대체)
  {
    id: 1,
    image: '/path/to/image1.jpg',
    score: '☆☆☆☆☆',
    title: '게시글 제목 1',
    user: '사용자1',
    createdAt: '2023.05.16 9:20',
    content:
      '내용이긴글1아무거나작성을해볼게요밑으로내려갈까요아님옆으로밀릴까요어떻게될까요',
    views: 32,
    likes: 10,
    bookmarks: 5,
  },
  {
    id: 2,
    title: '게시글 제목 2',
    user: '사용자2',
    content: '내용이긴글2',
    image: '/path/to/image2.jpg',
    views: 5,
  },
  {
    id: 3,
    title: '게시글 제목 3',
    user: '사용자3',
    content: '내용이긴글3달리노웨이이거작동하나요제발',
    image: '/path/to/image3.jpg',
    views: 18,
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
]);

// 내용을 제한된 길이로 자르고 생략 부호를 추가하는 함수
const truncateContent = (content: string, maxLength: number) => {
  if (content.length <= maxLength) {
    return content;
  } else {
    return content.slice(0, maxLength) + '...';
  }
};

onMounted(async () => {
  await useMyInfoStore().apiGetUser();
});
</script>

<template>
  <main>
    <h1>Home</h1>
    <div class="search-bar"></div>
    <div class="scroll-container">
      <div>
        <DreamDiaryView :posts="posts" />
        <div class="feed-container">
          <div v-for="post in posts" :key="post.id" class="post">
            <RouterLink :to="`/dream-diary/${post.id}`">
              <div class="text-color">
                <h2 class="feed-title">{{ post.title }}</h2>
                <p class="feed-user">{{ post.user }}</p>
                <p class="feed-content">
                  {{ truncateContent(post.content, 10) }}
                </p>
                <img :src="post.image" alt="Post Image" />
                <p>{{ post.views }}</p>
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
.feed-container {
  width: 100%;
  padding: 32px;
  background-color: transparent;
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
.feed-title {
  font-size: 16px;
}

.feed-user {
  font-size: 12px;
}
.feed-content {
  font-size: 12px;
}
</style>
