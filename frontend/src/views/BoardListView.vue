<template>
  <main>
    <div class="board-category">
      <div class="pageinfo">기타 게시판 목록</div>
      <button @click="selectBoard(BoardType.FREE)" class="board-free">
        자유
      </button>
      <button @click="selectBoard(BoardType.TIP)" class="board-sleep">
        수면 팁
      </button>
      <button @click="selectBoard(BoardType.REQUEST)" class="board-request">
        해몽 의뢰
      </button>
    </div>

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
          <button
            @click="selectCategory(searchType.TITLE)"
            class="search-title"
          >
            제목
          </button>
          <button
            @click="selectCategory(searchType.NICKNAME)"
            class="search-user"
          >
            유저
          </button>
          <button @click="selectCategory(searchType.NONE)" class="search-any">
            전체
          </button>
        </div>
      </div>
    </div>
    <div class="scroll-container">
      <div>
        <div v-for="post in filteredPosts" :key="post?.postId" class="feed">
          <RouterLink v-if="post" :to="`/board/${post.postId}`">
            <div class="feed-container">
              <h2 class="feed-title">{{ post.title }}</h2>
              <p class="feed-user">{{ post.author.nickname }}</p>
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
  </main>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted, computed, watch } from 'vue';
import { useMyInfoStore } from '@/stores/my.info.store';
import type { BoardList } from '@/types';
import { getBoardList } from '@/api/axios.custom';
import { BoardType } from '@/types/enum/board.type';
import { searchType } from '@/types/enum/search.type';

const posts = ref<BoardList[]>([]);
const arrlength = ref(1);
const searchKeyword = ref('');

const fetchData = async (post_type: BoardType, search_type: searchType) => {
  try {
    const page = 1;
    const length = 100;

    const response = await getBoardList(
      post_type,
      search_type,
      page,
      length,
      searchKeyword.value || '',
    );
    posts.value = response.data.posts;
    arrlength.value = response.data.totalLength;
  } catch (error) {
    console.error(error);
  }
};

const selectedBoard = ref<BoardType>(BoardType.FREE);
const selectedCategory = ref<searchType>(searchType.NONE);
const fetchKeyword = async (searchKeyword: string, length: number) => {
  try {
    const post_type = selectedBoard.value;
    const search_type = selectedCategory.value;
    const page = 1;

    const response = await getBoardList(
      post_type,
      search_type,
      page,
      length,
      searchKeyword || '',
    );
    posts.value = response.data.posts;
  } catch (error) {
    console.error(error);
  }
};

const handleSearch = () => {
  fetchKeyword(searchKeyword.value, arrlength.value);
};

const showCategoryOptions = ref(false);
const toggleCategoryOptions = () => {
  showCategoryOptions.value = !showCategoryOptions.value;
};

const selectCategory = async (category: searchType) => {
  selectedCategory.value = category;
  showCategoryOptions.value = false;
  await fetchKeyword(searchKeyword.value, arrlength.value);
};

const selectBoard = async (boardtype: BoardType) => {
  selectedBoard.value = boardtype;
  await fetchData(selectedBoard.value, selectedCategory.value);
};

const route = useRouter();
const newDiary = () => {
  route.push('/post/new');
};

onMounted(async () => {
  await useMyInfoStore().apiGetUser();
  await fetchData(BoardType.FREE, searchType.NONE);
});

const filteredPosts = computed(() => {
  const search_type = selectedCategory.value;
  const keyword = searchKeyword.value;
  if (!keyword) {
    return posts.value;
  }

  const filteredBySearchType = (post: BoardList) => {
    if (search_type === searchType.TITLE) {
      return post.title.includes(keyword);
    } else if (search_type === searchType.NICKNAME) {
      return post.author.nickname.includes(keyword);
    } else {
      return (
        post.title.includes(keyword) || post.author.nickname.includes(keyword)
      );
    }
  };

  const filteredByBoardType = (post: BoardList) => {
    return post.boardType === selectedBoard.value;
  };

  return posts.value.filter(
    (post) => filteredBySearchType(post) || filteredByBoardType(post),
  );
});

watch([selectedCategory, searchKeyword], () => {
  fetchKeyword(searchKeyword.value, arrlength.value);
  fetchData(selectedBoard.value, selectedCategory.value);
});
</script>

<style scoped>
.board-category {
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
.board-free {
  width: 52px;
  right: 18px;
  background-color: #666;
  border-radius: 10px;
  bottom: 19px;
  font-size: 12px;
}
.board-sleep {
  width: 60px;
  background-color: #666;
  border-radius: 10px;
  bottom: 19px;
  font-size: 12px;
}
.board-free:hover,
.board-sleep:hover,
.board-request:hover {
  background-color: rgb(197, 146, 255);
  font-weight: bold;
}
.board-request {
  width: 80px;
  left: 18px;
  background-color: #666;
  border-radius: 10px;
  bottom: 19px;
  font-size: 12px;
}
.newdiary-button {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  z-index: 4;
  bottom: 68px;
  left: 360px;
  background-color: white;
  transform: rotate(80deg);
}
.search {
  display: flex;
  flex-direction: row;
  position: fixed;
  z-index: 2;
  top: 120px;
}
.search-bar {
  height: 32px;
  width: 292px;
  top: 4px;
  background-color: #444;
  left: 32px;
  padding: 8px;
  border-radius: 28px;
  color: white;
  font-size: 12px;
}
.search-left {
  margin-left: 42px;
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
.search-any {
  background-color: white;
  border-radius: 10px;
  top: 4px;
}
.search-any:hover,
.search-title:hover,
.search-user:hover {
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
  top: 72px;
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
  font-size: 20px;
  font-weight: bold;
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
