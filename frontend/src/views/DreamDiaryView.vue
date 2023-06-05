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
      'https://i.pinimg.com/originals/55/7d/38/557d38dc2749c7aa8e0dba5b8f4415b0.jpg',
    score: '☆☆☆☆☆',
    title: '게시글 제목 1',
    user: '사용자1',
    createdAt: '2023.05.16 9:20',
    content:
      '내용이긴글1아무거나작성을해볼게요밑으로내려갈까요아님옆으로밀릴까요어떻게될까요가나다라마바사아자차카타파하아야어여오요우유으이 스크롤 범위를 알아보기 위해 최대한 길게 써보도록 할게요 우선은 가상 데이터들이지만 얘네들이 찐 데이터로 받아왔을 때 생각해봐야 하니까요 근데 아직 데이터 가져오는 걸 잘 모르겠어서 무지성으로 이렇게 길게 길게 써보도록 하겠습니다. 음 근데 스타일 지정이 생각보다 잘 안 되네요 굉장히 세부적으로 다뤄야하는데 틀 잡는 거보다 디테일이 더 오래 걸리네유',
    views: 32,
    likes: 10,
    bookmarks: 5,
    tag: '#해시태그1  #해시태그2',
    interprete: '아무말이나해봐',
  },
]);

const route = useRouter();

const gotoComment = () => {
  route.push('/comment/:filterType/:id');
};

const clickLike = () => {};

const clickBookmark = () => {};
</script>
<template>
  <hr />
  <main>
    <div v-for="post in posts" :key="post.id" class="post">
      <div class="one-post">
        <img
          :src="post.image"
          style="
            margin: 0 auto;
            top: 16px;
            width: 240px;
            height: auto;
            border-radius: 16px;
          "
        />
        <div class="post-box">
          <div class="post-score">{{ post.score }}</div>
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
            <div class="post-tag">{{ post.tag }}</div>
            <RouterLink to="read-dream"> 해몽보기 </RouterLink>
            <RouterView> </RouterView>
          </div>
        </div>
      </div>
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
  </main>
</template>

<style scoped>
.post {
  width: auto;
  color: white;
}
.one-post {
  z-index: 1;
}
.post-content::-webkit-scrollbar {
  width: 0px;
}
.post-box {
  top: 16px;
  width: 320px;
  margin: 0 auto;
}
.post-score {
  text-align: center;
  font-size: 24px;
}
.post-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
.icon-row {
  left: 52px;
  z-index: 2;
  top: 32px;
  font-size: 28px;
  color: white;
}

.go-comment {
  background-color: black;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  left: 182px;
}

.go-comment i {
  color: white;
  font-size: 28px;
}
.go-comment:hover i {
  color: mediumpurple; /* 마우스를 올렸을 때 아이콘의 색상 변경 */
}
.click-like {
  cursor: pointer;
}
.click-like i {
  font-size: 28px;
}
.click-bookmark {
  left: 20px;
}
.click-bookmark i {
  font-size: 28px;
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
  left: 160px;
}
.post-content {
  overflow-y: auto;
  scrollbar-width: thin;
  border-color: white;
  border-width: 1px 0;
  top: 8px;
  height: 230px;
}
</style>
