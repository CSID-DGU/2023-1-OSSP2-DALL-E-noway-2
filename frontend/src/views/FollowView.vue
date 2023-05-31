<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { FollowType } from '@/types/enum/follow.type';
import { ref } from 'vue';

const { params } = useRoute();
const userId = Number(params.userId);

const followType = ref(params.followType as FollowType);
function handleClick() {
  followType.value =
    followType.value === FollowType.FOLLOWING
      ? FollowType.FOLLOWER
      : FollowType.FOLLOWING;
}
</script>

<template>
  <div class="wrap">
    <div class="follow-bar">
      <div class="p-1">
        <RouterLink
          :to="`/profile/follow/${userId}/follower`"
          class="follow-content"
          :class="{ none: followType === FollowType.FOLLOWING }"
          v-on:click="handleClick"
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
          v-on:click="handleClick"
        >
          <h1>팔로잉</h1>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  @apply w-full flex flex-col justify-center h-full z-[1];
}

.follow-bar {
  @apply grid grid-flow-col text-center text-gray-500 bg-black rounded-lg p-1 ml-8 mr-8 relative top-24;
}

.follow-content {
  @apply flex justify-center py-2 text-white;
}

.follow-content.none {
  @apply flex justify-center py-2 text-gray-500;
}
</style>
