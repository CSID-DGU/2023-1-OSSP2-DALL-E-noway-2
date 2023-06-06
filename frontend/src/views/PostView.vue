<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { ref } from 'vue';
import DreamDiaryFeedView from './DreamDiaryFeedView.vue';
import '@fortawesome/fontawesome-free/css/all.css';

const feedposts = ref([DreamDiaryFeedView.posts]);

const posts = ref([
  // 게시글 데이터 (가상 데이터로 대체)
  {
    id: 1,
    image:
      'https://avatars.githubusercontent.com/u/31301280?s=200&v=4splash.com/photo-1621574539437-4b5b5b5b5b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjI0NjB8MHwxfHNlYXJjaHwxfHxkcmVhbXN0aW9ufGVufDB8fHx8MTYyMjE0NjY5Mg&ixlib=rb-1.2.1&q=80&w=1080',
    title: '게시글 제목 1',
    user: '사용자1',
    createdAt: '2023.05.16 9:20',
    content: '내용이긴글1',
    views: 32,
    likes: 10,
    bookmarks: 5,
  },
]);

const showCategoryOptions = ref(false);

const changeOptions = () => {
  showCategoryOptions.value = !showCategoryOptions.value;
};

const route = useRouter();

const gotoComment = () => {
  route.push('/comment/:filterType/:id');
};

const postModify = () => {
  route.push('/post/new');
};

const postDelete = () => {
  route.push('/board-list');
};

const clickLike = () => {};

const clickBookmark = () => {};
</script>
<template>
  <main>
    <div v-for="post in posts" :key="post.id" class="post">
      <div class="one-post">
        <img
          :src="post.image"
          style="
            margin: 0 auto;
            max-width: 340px;
            max-height: 240px;
            border-radius: 16px;
          "
        />
        <div class="post-box">
          <div class="post-title">{{ post.title }}</div>
          <div class="list-row">
            <div class="row-left">
              {{ post.user }}
            </div>
            <div class="row-middle">
              {{ post.createdAt }}
            </div>
            <duv class="row-right"> 👀 {{ post.views }} </duv>
          </div>
          <div class="post-content">
            <h1>{{ post.content }}</h1>
            <div class="icon-row">
              <button @click="clickLike" class="click-like">
                <i class="fas fa-heart"> {{ post.likes }}</i>
              </button>
              <button @click="clickBookmark" class="click-bookmark">
                <i class="fas fa-bookmark"> {{ post.bookmarks }}</i>
              </button>
              <button @click="gotoComment" class="go-comment">
                <i class="fas fa-comment"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="select-change">
      <button @click="changeOptions" class="change-button">⁝</button>
    </div>
    <div v-if="showCategoryOptions" class="delete-modify">
      <button @click="postDelete()" class="delete">삭제</button>
      <button @click="postModify()" class="modify">수정</button>
    </div>
  </main>
</template>

<style scoped>
.post {
  width: auto;
  color: white;
}
.one-post {
  overflow-y: auto;
  scrollbar-width: thin;
  z-index: 1;
  max-height: 600px;
}
.one-post::-webkit-scrollbar {
  width: 0px;
}
.post-box {
  top: 16px;
  width: 320px;
  margin: 0 auto;
}
.post-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
.icon-row {
  top: 16px;
  z-index: 2;
}
.go-comment {
  left: 224px;
}
.go-comment i {
  color: white;
  font-size: 20px;
}
.go-comment:hover i {
  color: magenta;
}
.click-like {
  cursor: pointer;
}
.click-like i {
  font-size: 20px;
}
.click-bookmark {
  left: 20px;
}
.click-bookmark i {
  font-size: 20px;
}
.list-row {
  display: flex;
  flex-direction: row;
  font-size: 12px;
}
.row-middle {
  left: 16px;
}
.row-right {
  left: 156px;
}
.post-content {
  height: 302px;
}
.change-button {
  background-color: white;
  color: #000;
  width: 28px;
  height: 28px;
  z-index: 4;
  border-radius: 28px;
  left: 374px;
  bottom: 476px;
}
.delete-modify {
  font-size: 12px;
  font-weight: bold;
  color: black;
  display: flex;
  flex-direction: column;
  left: 368px;
  bottom: 476px;
  z-index: 4;
  width: 40px;
}
.delete {
  top: 4px;
  background-color: white;
  border-radius: 10px;
}
.modify {
  background-color: white;
  top: 8px;
  border-radius: 10px;
}
</style>
