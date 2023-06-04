<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useMyInfoStore } from '@/stores/my.info.store';

const posts = ref([
  // 게시글 데이터 (가상 데이터로 대체)
  {
    id: 1,
    image: 'http://localhost:81/uploads/test.jpg',
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
    image:
      'https://avatars.githubusercontent.com/u/31301280?s=200&v=4splash.com/photo-1621574539437-4b5b5b5b5b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjI0NjB8MHwxfHNlYXJjaHwxfHxkcmVhbXN0aW9ufGVufDB8fHx8MTYyMjE0NjY5Mg&ixlib=rb-1.2.1&q=80&w=1080',
    views: 5,
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
]);

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  // 스크롤 이벤트 핸들러
  // 스크롤이 끝에 도달하면 추가적인 데이터 로드 등의 작업을 수행할 수 있음
};

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
    <div>
      <div class="feed-container" @scroll="handleScroll">
        <div v-for="post in posts" :key="post.id" class="post">
          <div class="text-color">
            <RouterLink to="/dream-diary/1">
              <h2 class="feed-title">{{ post.title }}</h2>
              <p class="feed-user">{{ post.user }}</p>
              <p class="feed-content">
                {{ truncateContent(post.content, 10) }}
              </p>
              <img :src="post.image" alt="Post Image" />
              <p>{{ post.views }}</p>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  @apply w-full flex flex-col justify-center h-full z-[1];
}

.search-bar {
  height: 40px;
  width: 320px;
  background-color: white;
  @apply inset-x-8;
  padding: 8px;
  border-radius: 28px;
}

.feed-container {
  width: 100%;
  padding: 32px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: transparent;
  @apply overflow-auto;
  height: 600px;
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
