<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { FollowType } from '@/types/enum/follow.type';
import { onMounted, ref, type Ref } from 'vue';
import { getFollowers, getFollowings } from '@/api/axios.custom';
import type { User, FollowUser } from '@/types';
// @ts-ignore
import InfiniteLoading from 'v3-infinite-loading';
import 'v3-infinite-loading/lib/style.css';
import { useMyInfoStore } from '@/stores/my.info.store';

const { params } = useRoute();
const userId = Number(params.userId);

const { getUser } = useMyInfoStore();
const mine = ref(getUser());

const followType = ref(params.followType as FollowType);
const curPage = ref(1);

interface FollowList {
  follows: FollowUser[];
  totalLength: number;
}
const followList: Ref<FollowList> = ref({
  follows: [],
  totalLength: 0,
});

const changeToFollower = async () => {
  if (followType.value === FollowType.FOLLOWER) return;
  followType.value = FollowType.FOLLOWER;
  await fetchFollows(1);
};

const changeToFollowing = async () => {
  if (followType.value === FollowType.FOLLOWING) return;
  followType.value = FollowType.FOLLOWING;
  await fetchFollows(1);
};

const fetchFollows = async (page: number) => {
  let response;
  try {
    if (followType.value === FollowType.FOLLOWER) {
      response = await getFollowers(userId, page, 10);
    } else {
      response = await getFollowings(userId, page, 10);
    }
    // response.data.follows.map((follow: User) => {
    //   follow.imageUrl = follow.imageUrl =
    //     'https://avatars.githubusercontent.com/u/31301280?s=200&v=4splash.com/photo-1621574539437-4b5b5b5b5b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjI0NjB8MHwxfHNlYXJjaHwxfHxkcmVhbXN0aW9ufGVufDB8fHx8MTYyMjE0NjY5Mg&ixlib=rb-1.2.1&q=80&w=1080';
    // });
    // followList.value = {
    //   follows: response.data.follows,
    //   totalLength: response.data.totalLength,
    // };
  } catch (error) {
    console.log(error);
  }
  for (let i = 1; i < 10; i++) {
    followList.value.follows.push({
      user: {
        userId: i,
        nickname: 'test',
        imageUrl: 'https://avatars.githubusercontent.com/u/31301280?s=200&v=4',
      },
      // FIXME: 임시로 isFollowed를 true, false로 설정
      // eslint-disable-next-line no-unneeded-ternary
      isFollowed: i % 2 === 0 ? true : false,
    });
  }
  console.log(followList);
};

const loadMore = async () => {
  console.log('loadMore');
  ++curPage.value;
  console.log(curPage.value);
  await fetchFollows(curPage.value + 1);
};

// 해당 뷰로 진입할 때마다 params의 followType을 가져와서, followType이 FOLLOWING이면
// getFollowings API를 호출하고, FOLLOWER이면 getFollowers API를 호출한다.
onMounted(async () => {
  try {
    if (mine.value.userId === 0) {
      await useMyInfoStore().apiGetUser();
      mine.value = getUser();
    }
  } catch (error) {
    console.log(error);
  }
  await fetchFollows(1);
});
</script>

<template>
  <div class="wrap">
    <div class="follow-bar">
      <div class="p-1">
        <RouterLink
          :to="`/profile/follow/${userId}/follower`"
          class="follow-content"
          :class="{ none: followType === FollowType.FOLLOWING }"
          v-on:click="changeToFollower"
        >
          <h1>팔로워</h1>
        </RouterLink>
      </div>
      <div class="p-1">
        <RouterLink
          :to="`/profile/follow/${userId}/following`"
          class="follow-content"
          :class="{
            none: followType === FollowType.FOLLOWER,
          }"
          v-on:click="changeToFollowing"
        >
          <h1>팔로잉</h1>
        </RouterLink>
      </div>
    </div>

    <div class="follow-list">
      <div
        v-for="follow in followList.follows"
        :key="follow.user.userId"
        class="follow-card"
      >
        <!-- 1행: 이미지 -->
        <div class="follow-image">
          <img :src="follow.user.imageUrl" alt="Profile Image" />
        </div>
        <!-- 2행: 닉네임 -->
        <div class="follow-info">
          <div class="name">{{ follow.user.nickname }}</div>
        </div>
        <!-- 3행: 팔로우 버튼 -->
        <div class="follow-button">
          <button
            class="follow-button-label"
            v-if="mine.userId === userId && followType === FollowType.FOLLOWER"
          >
            삭제
          </button>
          <button
            v-else-if="mine.userId !== userId && !follow.isFollowed"
            class="follow-button-label"
            :class="{
              'other-not-followed': !follow.isFollowed,
            }"
          >
            팔로우
          </button>
          <button
            v-else-if="mine.userId !== userId && follow.isFollowed"
            class="follow-button-label"
          >
            팔로잉
          </button>
          <button
            v-else-if="
              mine.userId === userId && followType === FollowType.FOLLOWING
            "
            class="follow-button-label"
          >
            팔로잉
          </button>
        </div>
      </div>
      <InfiniteLoading @infinite="loadMore"></InfiniteLoading>
    </div>
  </div>
</template>

<style scoped>
div {
  display: block;
}

.wrap {
  @apply w-full flex flex-col justify-center h-full z-[1];
}

.follow-bar {
  @apply grid grid-flow-col text-center text-gray-500 bg-black rounded-lg p-1 ml-8 mr-8 relative top-20;
}

.follow-content {
  @apply flex justify-center py-2 text-white;
}

.follow-content.none {
  @apply flex justify-center py-2 text-gray-500;
}

.follow-list {
  @apply mt-4 top-24 ml-8 mr-8 overflow-auto h-96;
}

.follow-card {
  @apply bg-black p-4 rounded-lg shadow grid;
}

.follow-image {
  grid-column: 1 / 2;
  grid-row: 1 / 4;
  @apply items-center justify-center rounded-full overflow-hidden;
}

.follow-image img {
  @apply w-12 h-12 object-cover rounded-full;
}

.follow-info {
  grid-column: 2 / 3;
  @apply justify-center text-white;
}

.follow-button {
  grid-column: 3 / 4;
  @apply flex flex-col justify-center items-center;
}

.follow-button-label {
  padding: 8px 16px;
  background-color: #262626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  @apply rounded-full;
}

.follow-button-label.other-not-followed {
  @apply bg-[#0098FD];
}
</style>
