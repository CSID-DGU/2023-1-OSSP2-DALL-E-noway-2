<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';

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
      '내용이긴글1아무거나작성을해볼게요밑으로내려갈까요아님옆으로밀릴까요어떻게될까요가나다라마바사아자차카타파하아야어여오요우유으이 스크롤 범위를 알아보기 위해 최대한 길게 써보도록 할게요 우선은 가상 데이터들이지만 얘네들이 찐 데이터로 받아왔을 때 생각해봐야 하니까요 근데 아직 데이터 가져오는 걸 잘 모르겠어서 무지성으로 이렇게 길게 길게 써보도록 하겠습니다. 음 근데 스타일 지정이 생각보다 잘 안 되네요 굉장히 세부적으로 다뤄야하는데 틀 잡는 거보다 디테일이 더 오래 걸리네유 근데 왜 링크 라우터 태그는 박스로 인식을 안 하는 거죠 그 밑으로 보내주세요 겹치는 거 싫어유',
    views: 32,
    likes: 10,
    bookmarks: 5,
    tag: '#해시태그1  #해시태그2',
    interprete: '해몽에는 무슨 내용이 들어갈까요',
  },
]);

const route = useRouter();

const gotoComment = () => {
  route.push('/comment/:filterType/:id');
};

const showCategoryOptions = ref(false);

const changeOptions = () => {
  showCategoryOptions.value = !showCategoryOptions.value;
};

const postModify = () => {
  route.push('/dream-diary/new');
};

const postDelete = () => {
  route.push('/home');
};

const showInterprete = ref(false);
const buttonInterprete = () => {
  showInterprete.value = !showInterprete.value;
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
            <button @click="buttonInterprete" class="read-dream">
              해몽보기
            </button>
            <div v-if="showInterprete" class="interpretation">
              {{ post.interprete }}
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
  max-height: 634px;
}
.one-post::-webkit-scrollbar {
  width: 0px;
}
.post-box {
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
  top: 36px;
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
  color: magenta; /* 마우스를 올렸을 때 아이콘의 색상 변경 */
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
  transition: red;
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
  min-height: auto;
}
.post-tag {
  top: 8px;
  font-size: 12px;
}
.read-dream {
  font-size: 12px;
  top: 16px;
}
.read-dream:active {
  text-decoration: underline;
}
.interpretation {
  font-size: 12px;
  top: 16px;
}
.change-button {
  background-color: white;
  color: #000;
  width: 28px;
  height: 28px;
  z-index: 4;
  border-radius: 28px;
  left: 374px;
  bottom: 636px;
}
.delete-modify {
  font-size: 12px;
  color: black;
  display: flex;
  flex-direction: column;
  left: 368px;
  bottom: 636px;
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
