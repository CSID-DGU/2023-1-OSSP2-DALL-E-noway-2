<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useMyInfoStore } from '@/stores/my.info.store';
import { categoryInfoStore } from '@/stores/category.info.store';

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
    image: 'https://t1.daumcdn.net/cfile/tistory/99C6FD385D6CAD1206',
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

const route = useRouter();
const newDiary = () => {
  route.push('/dream-diary/new');
};

const { fetchAllCategories } = categoryInfoStore();

onMounted(async () => {
  await useMyInfoStore().apiGetUser();
  await fetchAllCategories();
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
          <button @click="selectCategory('제목')" class="search-title">
            제목
          </button>
          <button @click="selectCategory('유저')" class="search-user">
            유저
          </button>
          <button @click="selectCategory('내용')" class="search-content">
            내용
          </button>
          <button @click="selectCategory('전체')" class="search-any">
            전체
          </button>
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
                  max-width: 260px;
                  max-height: auto;
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
    <button @click="newDiary" class="newdiary-button">
      <img
        src="https://e7.pngegg.com/pngimages/852/911/png-clipart-pen-pencil-cases-coloring-book-drawing-crayon-pencil-drawing-pencil-monochrome-thumbnail.png"
        alt="New Diary"
        style="border-radius: 24px"
      />
    </button>
  </main>
</template>

<style scoped>
.newdiary-button {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  z-index: 4;
  bottom: 32px;
  left: 360px;
  background-color: white;
  transform: rotate(80deg);
}
.search {
  display: flex;
  flex-direction: row;
  position: fixed;
  z-index: 2;
}
.search-bar {
  height: 32px;
  width: 280px;
  top: 4px;
  background-color: #444;
  left: 32px;
  padding: 8px;
  border-radius: 28px;
  color: white;
  font-size: 12px;
}
.search-left {
  margin-left: 44px;
}
.select-row {
  display: flex;
  flex-direction: row;
}
.search-keyword {
  font-size: 12px;
  font-weight: bold;
  color: black;
  top: 4px;
  display: flex;
  flex-direction: column;
}
.search-title {
  background-color: white;
  border-radius: 10px;
}
.search-user {
  background-color: white;
  border-radius: 10px;
  top: 2px;
}
.search-content {
  background-color: white;
  border-radius: 10px;
  top: 4px;
}
.search-any {
  background-color: white;
  border-radius: 10px;
  top: 6px;
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
  top: 4px;
  border-radius: 28px;
}
.scroll-container {
  height: 608px;
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
