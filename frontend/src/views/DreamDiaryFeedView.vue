<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useMyInfoStore } from '@/stores/my.info.store';

const posts = ref([
  // 게시글 데이터 (가상 데이터로 대체)
  {
    id: 1,
    image:
      'https://i.pinimg.com/originals/55/7d/38/557d38dc2749c7aa8e0dba5b8f4415b0.jpg',
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
    image:
      'https://avatars.githubusercontent.com/u/31301280?s=200&v=4splash.com/photo-1621574539437-4b5b5b5b5b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjI0NjB8MHwxfHNlYXJjaHwxfHxkcmVhbXN0aW9ufGVufDB8fHx8MTYyMjE0NjY5Mg&ixlib=rb-1.2.1&q=80&w=1080',
    views: 18,
  },
  {
    id: 4,
    title: '게시글 제목 4',
    user: '사용자4',
    content: '내용이긴글4',
    image:
      'https://i.pinimg.com/originals/55/7d/38/557d38dc2749c7aa8e0dba5b8f4415b0.jpg',
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

const showCategoryOptions = ref(false);
const selectedCategory = ref(' ');
const textSpan = ref<HTMLElement | null>(null);

const toggleCategoryOptions = () => {
  showCategoryOptions.value = !showCategoryOptions.value;
  if (selectedCategory.value && textSpan.value !== null) {
    textSpan.value.style.display = 'none';
  }
};

const selectCategory = (category: string) => {
  selectedCategory.value = category;
  showCategoryOptions.value = false; // 선택한 후 옵션 숨김
};

onMounted(async () => {
  await useMyInfoStore().apiGetUser();
});
</script>

<template>
  <main>
    <div class="search">
      <div>
        <input
          class="search-bar"
          type="text"
          placeholder="검색어를 입력해주세요."
          required
        />
      </div>
      <div class="search-left">
        <div class="select-row">
          <button @click="toggleCategoryOptions" class="dropdown-button">
            <span ref="textSpan" class="selected-not-yet">검색어선택</span>
            <div v-if="selectedCategory" class="selected-category">
              {{ selectedCategory }}
            </div>
          </button>
        </div>
        <div v-if="showCategoryOptions" class="search-keyword">
          <button @click="selectCategory('제목')">제목</button>
          <button @click="selectCategory('유저')">유저</button>
          <button @click="selectCategory('내용')">내용</button>
          <button @click="selectCategory('전체')">전체</button>
        </div>
      </div>
    </div>
    <div class="scroll-container">
      <div>
        <DreamDiaryView :posts="posts" />
        <div v-for="post in posts" :key="post.id" class="feed">
          <RouterLink :to="`/dream-diary/${post.id}`">
            <div class="feed-container">
              <h2 class="feed-title">{{ post.title }}</h2>
              <p class="feed-user">{{ post.user }}</p>
              <p class="feed-content">
                {{ truncateContent(post.content, 25) }}
              </p>
              <img
                :src="post.image"
                alt="Post Image"
                style="
                  margin: 0 auto;
                  width: 240px;
                  height: auto;
                  top: 12px;
                  border-radius: 16px;
                "
              />
              <div class="feed-view">
                <p>👀 {{ post.views }}</p>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.search {
  display: flex;
  flex-direction: row;
  position: fixed;
  @apply z-[2];
}
.search-bar {
  height: 32px;
  width: 280px;
  top: 4px;
  background-color: #444;
  @apply inset-x-8;
  padding: 8px;
  border-radius: 28px;
  color: #aaa;
  font-size: 12px;
}
.search-left {
  margin-left: 40px;
}
.select-row {
  display: flex;
  flex-direction: row;
}
.search-keyword {
  font-size: 16px;
  color: white;
  left: 2px;
  @apply inset-y-2;
  display: flex;
  flex-direction: column;
  background-color: black;
}
.search-keyword button {
  margin-bottom: 8px;
}
.selected-category {
  color: white;
  font-size: 16px;
}
.selected-not-yet {
  color: #aaa;
  font-size: 8px;
}
.dropdown-button {
  background-color: #444;
  color: black;
  width: 60px;
  height: 32px;
  @apply inset-y-1;
  border-radius: 28px;
}
.scroll-container {
  height: 604px;
  overflow-y: auto;
  scrollbar-width: thin;
  @apply inset-y-9 z-[1];
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
  background-color: transparent;
  margin: 0 auto;
  border-style: solid;
  border-color: white;
  border-width: 1px 0;
  color: white;
}
.feed-container {
  bottom: 8px;
  font-size: 12px;
}
.feed-title {
  font-size: 16px;
}
.feed-view {
  top: 20px;
}
</style>
