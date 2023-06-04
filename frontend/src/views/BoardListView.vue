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
      <div class="post-container">
        <div v-for="post in posts" :key="post.id" class="post">
          <RouterLink :to="`/board/${post.id}`">
            <div class="post-content">
              <div class="post-content-left">
                <h2 class="post-title">{{ post.title }}</h2>
                <p class="post-user">{{ post.user }}</p>
                <p>👀 {{ post.views }}</p>
              </div>
              <div class="post-content-right">
                <img
                  :src="post.image"
                  alt="Post Image"
                  style="width: auto; height: 60px; border-radius: 8px"
                />
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useMyInfoStore } from '@/stores/my.info.store';

const posts = ref([
  // 게시글 데이터 (가상 데이터로 대체)
  {
    id: 1,
    image:
      'https://avatars.githubusercontent.com/u/31301280?s=200&v=4splash.com/photo-1621574539437-4b5b5b5b5b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjI0NjB8MHwxfHNlYXJjaHwxfHxkcmVhbXN0aW9ufGVufDB8fHx8MTYyMjE0NjY5Mg&ixlib=rb-1.2.1&q=80&w=1080',
    title: '게시글 제목 1',
    user: '사용자1',
    createdAt: '2023.05.16 9:20',
    content: '내용이긴글1',
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
      'https://banbbom.com/data/froala/210226/3e4217ef66440659dea947942cdfb7aa18b07151.jpg',
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
  width: 8px; /* 스크롤바 너비 설정 */
}
.scroll-container::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 4px;
}
.post-container {
  width: 92%;
  padding: 20px;
  background-color: transparent;
  height: 100%;
  margin: 0 auto;
}
.post {
  margin-bottom: 0px;
  padding: 12px;
  border-style: solid;
  border-color: white;
  border-width: 1px 0;
  color: white;
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
