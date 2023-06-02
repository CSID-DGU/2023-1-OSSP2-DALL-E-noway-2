<script setup lang="ts">
import { getAllComments, getProfile, postComment } from '@/api/axios.custom';
import { useMyInfoStore } from '@/stores/my.info.store';
import type { User } from '@/types';
import { computed, onMounted, ref, type Ref } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import IconSend from '@/components/icons/IconSend.vue';

const { params } = useRoute();
const filterType = ref(params.filterType as string);
const id = ref(Number(params.id));

const { getUser } = useMyInfoStore();
const mine = ref(getUser());

interface Comment {
  commentId: number;
  id: number;
  parentCommentId: number;
  content: string;
  createdAt: Date;
  user: User;
}

const commentList: Ref<Comment[]> = ref([]);
const commentInput = ref('');
const commentListRef = ref<HTMLDivElement | null>(null);

const arrayLength = computed(() => commentList.value.length);

const initComments = async () => {
  const response = await getAllComments(filterType.value, id.value);
  // FIXME: 응답으로 UserDto 정보를 같이 받는게 좋을듯.
  // response.data.forEach((data: any) => {
  //   commentList.value.push({
  //     commentId: data.commentId,
  //     id: data.id,
  //     parentCommentId: data.parentCommentId,
  //     content: data.content,
  //     createdAt: data.createdAt,
  //     user: await getProfile(data.userId),
  //   });
  // });
  console.log(response.data.comments);

  commentList.value = [];
  for (let data of response.data.comments) {
    const user = await (await getProfile(data.userId)).data.user;
    commentList.value.push({
      commentId: data.commentId,
      id: data.id,
      parentCommentId: data.parentCommentId,
      content: data.content,
      createdAt: data.createdAt,
      user: user,
    });
  }
  console.log(commentList.value);
};

const sendComment = async () => {
  try {
    const response = await postComment(
      filterType.value,
      id.value,
      commentInput.value,
    );
    if (response.status === 201) {
      await initComments();
      commentInput.value = '';
      // @ts-ignore
      commentListRef.value.scrollTop = commentListRef.value.scrollHeight;
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  try {
    await useMyInfoStore().apiGetUser();
    mine.value = getUser();
    await initComments();
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="wrap">
    <div class="comment-count-bar">
      <h1>댓글({{ arrayLength }})</h1>
    </div>
    <div class="comment-list" ref="commentListRef">
      <div
        v-for="comment in commentList"
        :key="comment.commentId"
        class="comment-card"
      >
        <RouterLink :to="`/profile/${comment.user.userId}`">
          <div class="comment-user">
            <div class="comment-user-image">
              <img :src="comment.user.imageUrl" alt="user-image" />
            </div>
            <div class="comment-user-nickname">
              <h1>{{ comment.user.nickname }}</h1>
            </div>
          </div>
        </RouterLink>
        <div class="comment-content">
          <h1>{{ comment.content }}</h1>
        </div>
        <div class="comment-date">
          <h1>{{ comment.createdAt }}</h1>
        </div>
      </div>
    </div>
    <!-- 댓글 입력 칸 -->
    <div class="comment-input">
      <div class="comment-input-user">
        <div class="comment-input-user-image">
          <img :src="mine.imageUrl" alt="user-image" />
        </div>
        <div class="comment-input-user-nickname">
          <h1>{{ mine.nickname }}</h1>
        </div>
      </div>
      <div class="comment-input-content">
        <input
          v-model="commentInput"
          type="text"
          placeholder="댓글을 입력하세요"
        />
      </div>
      <!-- 댓글 전송 버튼 -->
      <div class="comment-input-send" @click="sendComment">
        <IconSend />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  @apply w-full flex flex-col justify-center h-full z-[1] bg-black;
  @apply text-white;
}

.comment-count-bar {
  @apply text-center text-white;
  @apply text-lg font-bold;
}

.comment-list {
  @apply mt-4 top-24 ml-8 mr-8 overflow-auto;
  height: 32rem;
}

.comment-card {
  @apply bg-black p-4 rounded-lg shadow grid;
}

.comment-user {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  @apply flex flex-row items-center;
}

.comment-user-image {
  @apply items-center justify-center rounded-full overflow-hidden;
}

.comment-user-image img {
  @apply w-12 h-12 object-cover rounded-full;
}

.comment-user-nickname {
  @apply ml-4;
}

.comment-content {
  grid-column: 1 / 3;
  grid-row: 2 / 3;
  @apply mt-4;
}

.comment-date {
  grid-column: 1 / 3;
  grid-row: 3 / 4;
  @apply mt-4;
}

.comment-input {
  @apply fixed bottom-0 left-0 right-0;
  @apply flex flex-row items-center;
  @apply bg-black p-4;
}

.comment-input-user {
  @apply flex flex-row items-center;
}

.comment-input-user-image {
  @apply items-center justify-center rounded-full overflow-hidden;
}

.comment-input-user-image img {
  @apply w-12 h-12 object-cover rounded-full;
}

.comment-input-user-nickname {
  @apply ml-4;
}

.comment-input-content {
  @apply ml-4;
}

.comment-input-content input {
  @apply w-full h-12 rounded-lg bg-gray-800;
  @apply text-white;
  @apply pl-4;
}

.comment-input-content input::placeholder {
  @apply text-white;
  @apply text-lg;
}

.comment-input-content input:focus {
  @apply outline-none;
}

.comment-input-send {
  @apply ml-4;
}
</style>
