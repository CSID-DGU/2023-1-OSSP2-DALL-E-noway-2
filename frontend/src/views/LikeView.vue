<script setup lang="ts">
import { ref } from 'vue';
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

const category = ref('꿈일기목록');

const selectCategory = (cate: string) => {
  category.value = cate;
};

const truncateContent = (content: string, maxLength: number) => {
  if (content.length <= maxLength) {
    return content;
  } else {
    return content.slice(0, maxLength) + '...';
  }
};
</script>

<template>
  <main>
    <div class="like-category">
      <div class="pageinfo">좋아요 목록</div>
      <div class="select-like-cate">
        <button @click="selectCategory('꿈일기목록')" class="like-dream-diary">
          꿈일기목록
        </button>
        <button @click="selectCategory('자유')" class="like-free">자유</button>
        <button @click="selectCategory('수면팁')" class="like-sleep">
          수면 팁
        </button>
        <button @click="selectCategory('해몽의뢰')" class="like-read-dream">
          해몽 의뢰
        </button>
      </div>
    </div>
    <div class="like-list">
      <template v-if="category === '꿈일기목록'">
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
      </template>
      <template v-else>
        <div class="scroll-container">
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
                    style="max-width: 84px; height: 60px; border-radius: 8px"
                  />
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </template>
      <!--
      <template v-else-if="category === '수면팁'"></template>
      <template v-else-if="category === '해몽의뢰'"></template>
      -->
    </div>
  </main>
</template>

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
  font-weight: bold;
}
.select-like-cate {
  font-size: 12px;
  top: 1px;
}
.like-dream-diary {
  width: 92px;
  background-color: #666;
  border-radius: 10px;
  right: 18px;
  bottom: 17px;
}
.like-free {
  width: 52px;
  right: 6px;
  background-color: #666;
  border-radius: 10px;
  bottom: 17px;
}
.like-sleep {
  left: 6px;
  width: 60px;
  background-color: #666;
  border-radius: 10px;
  bottom: 17px;
}
.like-read-dream {
  width: 80px;
  left: 18px;
  background-color: #666;
  border-radius: 10px;
  bottom: 17px;
}
.like-dream-diary:hover,
.like-free:hover,
.like-sleep:hover,
.like-read-dream:hover {
  background-color: rgb(197, 146, 255);
  font-weight: bold;
}
.scroll-container {
  height: 568px;
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
