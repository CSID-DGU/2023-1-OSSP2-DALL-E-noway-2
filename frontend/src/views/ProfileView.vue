<script setup lang="ts">
import ProfileBar from '@/components/profile/ProfileBar.vue';
import type { Board, DiaryFeed } from '@/types';
import { FilterType } from '@/types/enum/filter.type';
import { onMounted, ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { getUserDiaryFeeds, getUserBoards } from '@/api/axios.custom';
import type { BoardType } from '@/types/enum/board.type';
// @ts-ignore
import InfiniteLoading from 'v3-infinite-loading';

const { params } = useRoute();
const userId = Number(params.userId);

const selectedFilterType: Ref<FilterType> = ref(FilterType.DIARY);
const diaryFeeds: Ref<DiaryFeed[]> = ref([]);
const boardList: Ref<Board[]> = ref([]);

const MAX_LENGTH = 2;

const truncateContent = (content: string, maxLength: number) => {
  if (content.length <= maxLength) {
    return content;
  } else {
    return content.slice(0, maxLength) + '...';
  }
};

const initDiaryFeeds = async (page: number, length: number) => {
  try {
    const response = await getUserDiaryFeeds(userId, page, length);
    const results = response.data;
    if (response.status === 200) {
      diaryFeeds.value = [];
      // response.data의 각 요소 중 diaryImageUrl을 diaryFeeds의 각 요소 중 imageUrl로 옮겨줌
      for (let i = 0; i < results.dreamDiaryFeeds.length; i += 1) {
        diaryFeeds.value.push({
          diaryId: results.dreamDiaryFeeds[i].diaryId,
          title: results.dreamDiaryFeeds[i].title,
          content: results.dreamDiaryFeeds[i].content,
          nickname: results.dreamDiaryFeeds[i].nickname,
          viewCount: results.dreamDiaryFeeds[i].viewCount,
          imageUrl: results.dreamDiaryFeeds[i].diaryImageUrl,
        });
      }
    } else {
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
};

const initBoardList = async (
  boardtype: BoardType,
  page: number,
  length: number,
) => {
  try {
    const response = await getUserBoards(userId, boardtype, page, length);
    const results = response.data;
    if (response.status === 200) {
      // response.data의 각 요소 중 boardImageUrl을 boardList의 각 요소 중 imageUrl로 옮겨줌
      boardList.value = [];
      for (let i = 0; i < results.boardList.length; i += 1) {
        boardList.value.push({
          postId: results.boardList[i].postId,
          title: results.boardList[i].title,
          nickname: results.boardList[i].nickname,
          viewCount: results.boardList[i].viewCount,
          imageUrl: results.boardList[i].boardImageUrl,
        });
      }
    } else {
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
};

const curDiaryPage = ref(1);

const fetchDiaryFeeds = async (page: number, length: number) => {
  try {
    const response = await getUserDiaryFeeds(userId, page, length);
    const results = response.data;
    if (response.status === 200) {
      // response.data의 각 요소 중 diaryImageUrl을 diaryFeeds의 각 요소 중 imageUrl로 옮겨줌
      for (let i = 0; i < results.dreamDiaryFeeds.length; i += 1) {
        diaryFeeds.value.push({
          diaryId: results.dreamDiaryFeeds[i].diaryId,
          title: results.dreamDiaryFeeds[i].title,
          content: results.dreamDiaryFeeds[i].content,
          nickname: results.dreamDiaryFeeds[i].nickname,
          viewCount: results.dreamDiaryFeeds[i].viewCount,
          imageUrl: results.dreamDiaryFeeds[i].diaryImageUrl,
        });
      }
    } else {
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
};

// @ts-ignore
const loadMoreDiary = async ($state) => {
  try {
    const response = await getUserDiaryFeeds(
      userId,
      // @ts-ignore
      curDiaryPage.value + 1,
      MAX_LENGTH,
    );
    const results = response.data;
    if (response.status === 200) {
      // response.data의 각 요소 중 diaryImageUrl을 diaryFeeds의 각 요소 중 imageUrl로 옮겨줌
      for (let i = 0; i < results.dreamDiaryFeeds.length; i += 1) {
        diaryFeeds.value.push({
          diaryId: results.dreamDiaryFeeds[i].diaryId,
          title: results.dreamDiaryFeeds[i].title,
          content: results.dreamDiaryFeeds[i].content,
          nickname: results.dreamDiaryFeeds[i].nickname,
          viewCount: results.dreamDiaryFeeds[i].viewCount,
          imageUrl: results.dreamDiaryFeeds[i].diaryImageUrl,
        });
      }
      if (response.data.dreamDiaryFeeds.length < MAX_LENGTH) {
        $state.complete();
      } else {
        $state.loaded();
      }
      ++curDiaryPage.value;
    }
    console.log(`curDiaryPage: ${curDiaryPage.value}`);
  } catch (error) {
    console.log(error);
  }
};

const curBoardPage = ref(1);

// @ts-ignore
const loadMoreBoard = async ($state) => {
  try {
    const response = await getUserBoards(
      userId,
      // @ts-ignore
      selectedFilterType.value as BoardType,
      curBoardPage.value + 1,
      MAX_LENGTH,
    );
    const results = response.data;
    if (response.status === 200) {
      // response.data의 각 요소 중 boardImageUrl을 boardList의 각 요소 중 imageUrl로 옮겨줌
      for (let i = 0; i < results.boardList.length; i += 1) {
        boardList.value.push({
          postId: results.boardList[i].postId,
          title: results.boardList[i].title,
          nickname: results.boardList[i].nickname,
          viewCount: results.boardList[i].viewCount,
          imageUrl: results.boardList[i].boardImageUrl,
        });
      }
      if (response.data.boardList.length < MAX_LENGTH) {
        $state.complete();
      } else {
        $state.loaded();
      }
      ++curBoardPage.value;
    }
    console.log(`curBoardPage: ${curBoardPage.value}`);
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => selectedFilterType.value,
  async (value) => {
    if (value === FilterType.DIARY) {
      await initDiaryFeeds(1, MAX_LENGTH);
    } else {
      // @ts-ignore
      await initBoardList(value as BoardType, 1, MAX_LENGTH);
    }
  },
);

onMounted(async () => {
  await initDiaryFeeds(1, MAX_LENGTH);
});
</script>

<template>
  <div class="wrap">
    <ProfileBar :userId="userId" />
    <div class="filter-type-bar">
      <div
        class="filter-type-content"
        :class="{ selected: selectedFilterType === FilterType.DIARY }"
        @click="selectedFilterType = FilterType.DIARY"
      >
        <h1>꿈일기</h1>
      </div>

      <div
        class="filter-type-content"
        :class="{ selected: selectedFilterType === FilterType.FREE }"
        @click="selectedFilterType = FilterType.FREE"
      >
        <h1>자유</h1>
      </div>

      <div
        class="filter-type-content"
        :class="{ selected: selectedFilterType === FilterType.TIP }"
        @click="selectedFilterType = FilterType.TIP"
      >
        <h1>수면 팁</h1>
      </div>

      <div
        class="filter-type-content"
        :class="{ selected: selectedFilterType === FilterType.REQUEST }"
        @click="selectedFilterType = FilterType.REQUEST"
      >
        <h1>해몽 의뢰</h1>
      </div>
    </div>

    <div class="diary-container">
      <div v-if="selectedFilterType === FilterType.DIARY" class="diary-list">
        <div v-for="diaryFeed in diaryFeeds" :key="diaryFeed.diaryId">
          <div class="diary-card">
            <RouterLink :to="`/dream-diary/${diaryFeed.diaryId}`">
              <h2 class="feed-title">{{ diaryFeed.title }}</h2>
              <p class="feed-user">{{ diaryFeed.nickname }}</p>
              <p class="feed-content">
                {{ truncateContent(diaryFeed.content, 25) }}
              </p>
              <p class="feed-view">👀 {{ diaryFeed.viewCount }}</p>
              <img :src="diaryFeed.imageUrl" alt="Post Image" />
            </RouterLink>
          </div>
        </div>
        <InfiniteLoading @infinite="loadMoreDiary"></InfiniteLoading>
      </div>
    </div>

    <div class="board-container">
      <div v-if="selectedFilterType === FilterType.FREE" class="board-list">
        <div v-for="board in boardList" :key="board.postId">
          <RouterLink :to="`/board/${board.postId}`">
            <div class="board-card">
              <div class="board-card-left">
                <h2 class="board-title">{{ board.title }}</h2>
                <p class="board-user">{{ board.nickname }}</p>
                <p class="board-view">👀 {{ board.viewCount }}</p>
              </div>
              <div class="board-card-right">
                <img :src="board.imageUrl" alt="Post Image" />
              </div>
            </div>
          </RouterLink>
        </div>
        <InfiniteLoading @infinite="loadMoreBoard"></InfiniteLoading>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  @apply relative;
  @apply overflow-y-auto;
  @apply w-full flex flex-col justify-center h-full z-[1];
}

/* 필터 선택 바 */
.filter-type-bar {
  @apply w-full flex flex-row justify-center h-full;
  @apply bg-black text-white;
}

.filter-type-content {
  @apply justify-center py-2 text-gray-500;
  @apply m-3;
}

.filter-type-content.selected {
  @apply justify-center py-2 text-white;
}

.filter-type-content:hover {
  @apply justify-center py-2 text-white;
}

/* 일기 */
.diary-container {
  @apply flex overflow-y-auto;
}

.diary-list {
  @apply flex-shrink-0;
  @apply w-full h-[500px];
  color: white;
  width: 84%;
  margin: 0 auto;
}

.diary-card {
  /* @apply text-white;
  @apply m-4; */
  @apply flex flex-row justify-between;
  @apply border-solid border-white;
  border-width: 1px 0;
  @apply p-3;
}

.diary-card tag {
  @apply m-2;
}

.diary-card img {
  @apply w-32 h-32;
  @apply rounded-2xl;
}
.feed-title {
  @apply text-2xl font-bold;
}
.feed-view {
  @apply flex flex-row;
}

/* 기타 게시글 */

.board-container {
  @apply flex overflow-y-auto;
}

.board-list {
  @apply flex-shrink-0;
  @apply w-full h-[500px];
  color: white;
  width: 84%;
  margin: 0 auto;
}

.board-card {
  @apply flex flex-row justify-between;
  @apply border-solid border-white;
  border-width: 1px 0;
  @apply p-3;
}

.board-card-left {
  @apply flex flex-col;
  margin-right: 10px;
  font-size: 12px;
  left: 0;
}

.board-card-right {
}

.board-card tag {
  @apply m-2;
}

.board-card img {
  @apply w-full h-full;
  @apply rounded-2xl;
  max-width: 84px;
  height: 60px;
  border-radius: 8px;
}
.board-title {
  @apply text-2xl font-bold;
}
.board-view {
  @apply flex flex-row;
}
</style>
