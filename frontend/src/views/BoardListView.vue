<template>
  <main>
    <div class="like-category">
      <div class="pageinfo">기타 게시판 목록</div>
      <button @click="selectCategory(BoardType.FREE)" class="like-free">
        자유
      </button>
      <button @click="selectCategory(BoardType.TIP)" class="like-sleep">
        수면 팁
      </button>
      <button
        @click="selectCategory(BoardType.REQUEST)"
        class="like-read-dream"
      >
        해몽 의뢰
      </button>
    </div>
    <div class="search">
      <div>
        <input
          class="search-bar"
          v-model="search_keyword"
          type="text"
          placeholder="검색어를 입력해주세요."
          required
          @keypress="handleKeyPress"
        />
        />
      </div>
      <div class="search-left">
        <div class="select-row">
          <button @click="toggleResearchOptions" class="dropdown-button">
            <span ref="textSpan" class="selected-not-yet">검색어선택</span>
            <div v-if="selectedResearch" class="selected-category">
              {{ selectedResearch }}
            </div>
          </button>
        </div>
        <div v-if="showResearchOptions" class="search-keyword">
          <button
            @click="selectResearch(searchType.TITLE)"
            class="search-title"
          >
            제목
          </button>
          <button
            @click="selectResearch(searchType.NICKNAME)"
            class="search-user"
          >
            유저
          </button>
          <button
            @click="selectResearch(searchType.CONTENT)"
            class="search-content"
          >
            내용
          </button>
          <button @click="selectResearch(searchType.NONE)" class="search-any">
            전체
          </button>
        </div>
      </div>
    </div>
    <div class="scroll-container">
      <div v-for="post in filteredPosts" :key="post.postId" class="post">
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
    <button @click="newPost" class="newpost-button">
      <img
        src="https://e7.pngegg.com/pngimages/852/911/png-clipart-pen-pencil-cases-coloring-book-drawing-crayon-pencil-drawing-pencil-monochrome-thumbnail.png"
        alt="NewPost"
        style="border-radius: 24px"
      />
    </button>
  </main>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { useMyInfoStore } from '@/stores/my.info.store';
import { ref, onMounted, computed, watch } from 'vue';
import type { Board } from '@/types';
import { getBoardList } from '@/api/axios.custom';
import { BoardType } from '@/types/enum/board.type';
import { searchType } from '@/types/enum/search.type';

const posts = ref<Board[]>([]);
const arrlength = ref(1);
const search_keyword = ref('');
const showResearchOptions = ref(false);
const category = ref<BoardType>(BoardType.FREE);
const selectedResearch = ref<searchType>(searchType.NONE);
const textSpan = ref<HTMLElement | null>(null);

const fetchData = async (post_type: BoardType, search_type: searchType) => {
  try {
    const page = 1;
    const search_keyword = '';
    const length = arrlength.value;

    const response = await getBoardList(
      post_type,
      page,
      length,
      search_keyword,
      search_type,
    );
    posts.value = response.data.posts;
    arrlength.value = response.data.totalLength;
  } catch (error) {
    console.error(error);
  }
};
const fetchKeyword = async (search_keyword: string) => {
  try {
    const page = 1;
    const post_type = category.value;
    const length = arrlength.value;
    const search_type = selectedResearch.value;

    const response = await getBoardList(
      post_type,
      page,
      length,
      search_keyword,
      search_type,
    );
    posts.value = response.data.posts;
  } catch (error) {
    console.error(error);
  }
};

const toggleResearchOptions = () => {
  showResearchOptions.value = !showResearchOptions.value;
  if (selectedResearch.value && textSpan.value !== null) {
    textSpan.value.style.display = 'none';
  }
};

const selectCategory = (cate: BoardType) => {
  category.value = cate;
};

const selectResearch = (research: searchType) => {
  selectedResearch.value = research;
  showResearchOptions.value = false;
};

const route = useRouter();
const newPost = () => {
  route.push('/post/new');
};

onMounted(async () => {
  await useMyInfoStore().apiGetUser();
  await fetchData(category.value, selectedResearch.value);
});

const filteredPosts = computed(() => {
  const search_type = selectedResearch.value;
  const keyword = search_keyword.value;
  if (!keyword) {
    return posts.value;
  }
  if (search_type === searchType.TITLE) {
    return posts.value.filter((post) => post.title.includes(keyword));
  } else if (search_type === searchType.NICKNAME) {
    return posts.value.filter((post) => post.nickname.includes(keyword));
  } else if (search_type === searchType.CONTENT) {
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

const handleKeyPress = async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    await fetchKeyword('');
  }
};

watch([selectedResearch, search_keyword], () => {
  fetchKeyword(search_keyword.value);
});
</script>

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
  color: white;
  font-weight: bold;
}
.like-free {
  width: 52px;
  right: 18px;
  background-color: #666;
  border-radius: 10px;
  bottom: 19px;
  font-size: 12px;
}
.like-sleep {
  width: 60px;
  background-color: #666;
  border-radius: 10px;
  bottom: 19px;
  font-size: 12px;
}
.like-free:hover,
.like-sleep:hover,
.like-read-dream:hover {
  background-color: rgb(197, 146, 255);
  font-weight: bold;
}
.like-read-dream {
  width: 80px;
  left: 18px;
  background-color: #666;
  border-radius: 10px;
  bottom: 19px;
  font-size: 12px;
}
.newpost-button {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  z-index: 4;
  left: 360px;
  background-color: white;
  transform: rotate(80deg);
}
.search {
  display: flex;
  flex-direction: row;
  position: fixed;
  z-index: 2;
  top: 124px;
}
.search-bar {
  height: 32px;
  width: 290px;
  background-color: #444;
  left: 32px;
  padding: 8px;
  border-radius: 16px;
  color: #aaa;
  font-size: 12px;
}
.search-left {
  margin-left: 22px;
}
.select-row {
  display: flex;
  flex-direction: row;
}
.search-keyword {
  font-size: 12px;
  color: black;
  top: 8px;
  display: flex;
  flex-direction: column;
}
.search-title {
  background-color: white;
  border-radius: 10px;
  cursor: pointer;
}
.search-title:hover,
.search-user:hover,
.search-content:hover,
.search-any:hover {
  background-color: rgb(197, 146, 255);
  font-weight: bold;
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
  font-size: 14px;
  font-weight: bold;
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
  border-radius: 28px;
}
.scroll-container {
  height: 540px;
  overflow-y: auto;
  scrollbar-width: thin;
  top: 72px;
  z-index: 1;
  margin: 0 auto;
}
.scroll-container::-webkit-scrollbar {
  width: 0px;
}
.scroll-container::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 4px;
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
