<template>
  <main>
    <div class="search">
      <div>
        <input
          class="search-bar"
          v-model="searchKeyword"
          type="text"
          placeholder="검색어를 입력해주세요."
          required
          @keydown.enter="handleSearch"
        />
      </div>
      <div class="search-left">
        <div class="select-row">
          <button @click="toggleCategoryOptions" class="dropdown-button">
            <span v-if="!selectedCategory" class="selected-not-yet"
              >검색어 선택</span
            >
            <div v-else class="selected-category">
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
        <div v-for="post in filteredPosts" :key="post?.diaryId" class="feed">
          <RouterLink v-if="post" :to="`/dream-diary/${post.diaryId}`">
            <div class="feed-container">
              <h2 class="feed-title">{{ post.title }}</h2>
              <p class="feed-user">{{ post.nickname }}</p>
              <p class="feed-content">
                {{ truncateContent(post.content, 25) }}
              </p>
              <img :src="post.imageUrl" alt="Post Image" class="feed-image" />
              <div class="feed-view">
                <p>👀 {{ post.viewCount }}</p>
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
    <!-- 최초 로그인 시, 프로필 설정 모달 -->
    <ProfileEdit v-if="isEditing()" />
  </main>
</template>

<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed, watch } from 'vue';
import { useMyInfoStore } from '@/stores/my.info.store';
import { categoryInfoStore } from '@/stores/category.info.store';
import type { DiaryFeed } from '@/types';
import { getDreamDiaryFeedList } from '@/api/axios.custom';
import { useProfileStore } from '@/stores/profile.store';
import ProfileEdit from '@/components/profile/ProfileEdit.vue';

const { setEditing, isEditing } = useProfileStore();
const route = useRouter();
const newDiary = () => {
  route.push('/dream-diary/new');
};
const { query } = useRoute();
const editing = ref(isEditing());
const isFirstLogin = query.isFirstLogin === 'true';
if (isFirstLogin) {
  setEditing(true);
  route.push('/home');
}
watch(isEditing, (value) => {
  editing.value = value;
});

const posts = ref<DiaryFeed[]>([]);
const arrlength = ref(1);
const searchKeyword = ref('');

const fetchData = async (searchType: string) => {
  try {
    const page = 1;
    const length = 100;
    const keyword = '';

    const response = await getDreamDiaryFeedList(
      searchType,
      page,
      length,
      keyword,
    );
    posts.value = response.data.dreamDiaryFeeds;
    arrlength.value = response.data.totalLength;
  } catch (error) {
    console.error(error);
  }
};

const fetchKeyword = async (keyword: string, length: number) => {
  try {
    const searchType = selectedCategory.value;
    const page = 1;

    const response = await getDreamDiaryFeedList(
      searchType,
      page,
      length,
      keyword,
    );
    posts.value = response.data.dreamDiaryFeeds;
  } catch (error) {
    console.error(error);
  }
};

const handleSearch = () => {
  fetchKeyword(searchKeyword.value, arrlength.value);
};

const truncateContent = (content: string, maxLength: number) => {
  if (!content) {
    return '';
  }
  if (content.length <= maxLength) {
    return content;
  } else {
    return content.slice(0, maxLength) + '...';
  }
};

const showCategoryOptions = ref(false);
const selectedCategory = ref('');

const toggleCategoryOptions = () => {
  showCategoryOptions.value = !showCategoryOptions.value;
};

const selectCategory = (category: string) => {
  selectedCategory.value = category;
  showCategoryOptions.value = false;
  const keyword = '';
  fetchKeyword(keyword, arrlength.value);
};

const { fetchAllCategories } = categoryInfoStore();

onMounted(async () => {
  await useMyInfoStore().apiGetUser();
  await fetchAllCategories();
  await fetchData('전체');
});

const filteredPosts = computed(() => {
  const searchType = selectedCategory.value;
  const keyword = searchKeyword.value;
  if (!keyword) {
    return posts.value;
  }
  if (searchType === '제목') {
    return posts.value.filter((post) => post.title.includes(keyword));
  } else if (searchType === '유저') {
    return posts.value.filter((post) => post.nickname.includes(keyword));
  } else if (searchType === '내용') {
    return posts.value.filter((post) => post.content.includes(keyword));
  } else {
    return posts.value.filter((post) => {
      return (
        post.title.includes(keyword) ||
        post.nickname.includes(keyword) ||
        post.content.includes(keyword)
      );
    });
  }
});
</script>

<style scoped>
.newdiary-button {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  z-index: 4;
  bottom: 36px;
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
.search-any:hover,
.search-title:hover,
.search-user:hover,
.search-content:hover {
  background-color: rgb(197, 146, 255);
  font-weight: bold;
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
  width: 0px;
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
.feed-image {
  margin: 0 auto;
  max-width: 260px;
  max-height: auto;
  top: 12px;
  border-radius: 16px;
}
</style>
