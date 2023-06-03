<script setup lang="ts">
import {
  getAllComments,
  getProfile,
  postComment,
  postReply,
  deleteComment,
} from '@/api/axios.custom';
import { useMyInfoStore } from '@/stores/my.info.store';
import type { User } from '@/types';
import { computed, onMounted, ref, type Ref } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import IconSend from '@/components/icons/IconSend.vue';
import IconThreeDots from '@/components/icons/IconThreeDots.vue';

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
const replyInputs: Record<number, string> = {};
const openReplyInputs: Ref<Set<number>> = ref(new Set());

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

const sendReply = async (commentId: number) => {
  const replyInput = replyInputs[commentId];
  if (replyInput) {
    try {
      const response = await postReply(
        filterType.value,
        id.value,
        commentId,
        replyInput,
      );
      if (response.status === 201) {
        showReplyOptions(commentId);
        await initComments();
        replyInputs[commentId] = ''; // clear reply input
        // @ts-ignore
        commentListRef.value.scrollTop = commentListRef.value.scrollHeight; // scroll to bottom
        openReplyInputs.value.delete(commentId); // close reply input
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const removeComment = async (commentId: number) => {
  try {
    const response = await deleteComment(commentId);
    if (response.status === 200) {
      showReplyOptions(commentId);
      await initComments();
    }
  } catch (error) {
    console.log(error);
  }
};

const isReplyInputVisible = (commentId: number): boolean => {
  return openReplyInputs.value.has(commentId);
};

const toggleReplyInput = (commentId: number): void => {
  if (isReplyInputVisible(commentId)) {
    openReplyInputs.value.delete(commentId);
  } else {
    openReplyInputs.value.add(commentId);
  }
};

const showReplyOptionsFor = ref<number | null>(null);

const showReplyOptions = (commentId: number) => {
  if (showReplyOptionsFor.value === commentId) {
    showReplyOptionsFor.value = null;
  } else {
    showReplyOptionsFor.value = commentId;
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
      <!-- comment.parentCommentId !== 0이라면 reply-card 클래스 적용 -->
      <div
        v-for="comment in commentList"
        :key="comment.commentId"
        class="comment-card"
        :class="{ 'reply-card': comment.parentCommentId !== null }"
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

        <!-- ... 토글 버튼 -->
        <div
          class="toggle-reply-button"
          @click="showReplyOptions(comment.commentId)"
        >
          <IconThreeDots />
        </div>

        <!-- 더보기 옵션 -->
        <div
          v-if="showReplyOptionsFor === comment.commentId"
          class="reply-options"
        >
          <div
            class="reply-option"
            @click="toggleReplyInput(comment.commentId)"
          >
            <IconReply /> 답글 달기
          </div>
          <div
            v-if="comment.user.userId === mine.userId"
            class="reply-option"
            @click="removeComment(comment.commentId)"
          >
            <IconDelete /> 댓글 삭제
          </div>
        </div>

        <!-- 답글 입력 칸 -->
        <div v-if="isReplyInputVisible(comment.commentId)" class="reply-input">
          <input
            v-model="replyInputs[comment.commentId]"
            type="text"
            placeholder="답글을 입력하세요"
          />
          <div class="reply-send" @click="sendReply(comment.commentId)">
            <IconSend />
          </div>
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

.reply-input {
  @apply flex flex-row items-center mt-4;
}

.reply-input input {
  @apply w-full h-12 rounded-lg bg-gray-800;
  @apply text-white;
  @apply pl-4;
}

.reply-send {
  @apply ml-4;
}

.toggle-reply-button {
  @apply ml-auto mr-2;
  cursor: pointer;
}

.reply-input {
  @apply flex flex-row items-center mt-4 opacity-80;
}

.replies {
  @apply ml-8 mt-4;
}

.reply-card {
  @apply bg-gray-800 p-4 rounded-lg shadow grid;
  @apply opacity-75;
}

.reply-content {
  @apply mt-2;
}

.toggle-reply-button {
  @apply ml-auto;
  @apply cursor-pointer;
}

.reply-options {
  @apply mt-1 flex flex-col absolute bg-gray-900 p-2 rounded-lg;
}

.reply-option {
  @apply flex flex-row items-center;
  @apply cursor-pointer;
}

.reply-option:hover {
  @apply text-blue-500;
}
</style>
