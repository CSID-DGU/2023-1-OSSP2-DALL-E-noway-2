<template>
  <main>
    <div class="like-category">
      <div class="pageinfo">기타 게시판 목록</div>
      <button @click="selectCategory('자유')" class="like-free">자유</button>
      <button @click="selectCategory('수면팁')" class="like-sleep">
        수면 팁
      </button>
      <button @click="selectCategory('해몽의뢰')" class="like-read-dream">
        해몽 의뢰
      </button>
    </div>
    <div class="search">
      <div>
        <input
          class="search-bar"
          type="text"
          placeholder="검색어를 입력해주세요."
          required
        />
      </div>
      <div class="search-left">
        <div class="select-row">
          <button @click="toggleResearchOptions" class="dropdown-button">
            <span ref="textSpan" class="selected-not-yet">검색어선택</span>
            <div v-if="selectedResearch" class="selected-category">
              {{ selectedResearch }}
            </div>
          </button>
        </div>
        <div v-if="showResearchOptions" class="search-keyword">
          <button @click="selectResearch('제목')" class="search-title">
            제목
          </button>
          <button @click="selectResearch('유저')" class="search-user">
            유저
          </button>
          <button @click="selectResearch('내용')" class="search-content">
            내용
          </button>
          <button @click="selectResearch('전체')" class="search-any">
            전체
          </button>
        </div>
      </div>
    </div>
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
    <button @click="newPost" class="newpost-button">
      <img
        src="https://e7.pngegg.com/pngimages/852/911/png-clipart-pen-pencil-cases-coloring-book-drawing-crayon-pencil-drawing-pencil-monochrome-thumbnail.png"
        alt="NewPost"
        style="border-radius: 24px"
      />
    </button>
  </main>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useMyInfoStore } from '@/stores/my.info.store';

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
  {
    id: 2,
    title: '게시글 제목 2',
    user: '사용자2',
    content: '내용이긴글2',
    image:
      'https://banbbom.com/data/froala/210226/3e4217ef66440659dea947942cdfb7aa18b07151.jpg',
    views: 5,
  },
  {
    id: 3,
    title: '게시글 제목 3',
    user: '사용자3',
    content: '내용이긴글3달리노웨이이거작동하나요제발',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShJbsvnGoJrZemz5Xj2DHm1jcitbT5pfw0eg&usqp=CAU',
    views: 18,
  },
  {
    id: 4,
    title: '게시글 제목 4',
    user: '사용자4',
    content: '내용이긴글4',
    image: '/path/to/image4.jpg',
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
  {
    id: 6,
    title: '게시글 제목 6',
    user: '사용자6',
    content: '내용이긴글6',
    image: '/path/to/image6.jpg',
    views: 7,
  },
  {
    id: 7,
    title: '게시글 제목 7',
    user: '사용자7',
    content: '내용이긴글7',
    image: '/path/to/image7.jpg',
    views: 2,
  },
  {
    id: 8,
    title: '게시글 제목 8',
    user: '사용자8',
    content: '내용이긴글8',
    image: '/path/to/image8.jpg',
    views: 14,
  },
]);

const showResearchOptions = ref(false);
const category = ref('자유');
const selectedResearch = ref(' ');
const textSpan = ref<HTMLElement | null>(null);

const toggleResearchOptions = () => {
  showResearchOptions.value = !showResearchOptions.value;
  if (selectedResearch.value && textSpan.value !== null) {
    textSpan.value.style.display = 'none';
  }
};
const selectCategory = (cate: string) => {
  category.value = cate;
};

const selectResearch = (research: string) => {
  selectedResearch.value = research;
  showResearchOptions.value = false;
};

const route = useRouter();
const newPost = () => {
  route.push('/post/new');
};

onMounted(async () => {
  await useMyInfoStore().apiGetUser();
});
</script>

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
  color: white;
  font-weight: bold;
}
.like-free {
  width: 52px;
  right: 18px;
  background-color: #666;
  border-radius: 10px;
  bottom: 19px;
  font-size: 12px;
}
.like-sleep {
  width: 60px;
  background-color: #666;
  border-radius: 10px;
  bottom: 19px;
  font-size: 12px;
}
.like-free:hover,
.like-sleep:hover,
.like-read-dream:hover {
  background-color: rgb(197, 146, 255);
  font-weight: bold;
}
.like-read-dream {
  width: 80px;
  left: 18px;
  background-color: #666;
  border-radius: 10px;
  bottom: 19px;
  font-size: 12px;
}
.newpost-button {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  z-index: 4;
  left: 360px;
  background-color: white;
  transform: rotate(80deg);
}
.search {
  display: flex;
  flex-direction: row;
  position: fixed;
  z-index: 2;
  top: 124px;
}
.search-bar {
  height: 32px;
  width: 290px;
  background-color: #444;
  left: 32px;
  padding: 8px;
  border-radius: 16px;
  color: #aaa;
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
  top: 8px;
  display: flex;
  flex-direction: column;
}
.search-title {
  background-color: white;
  border-radius: 10px;
  cursor: pointer;
}
.search-title:hover,
.search-user:hover,
.search-content:hover,
.search-any:hover {
  background-color: rgb(197, 146, 255);
  font-weight: bold;
}
.search-user {
  background-color: white;
  border-radius: 10px;
  top: 2px;
}

.search-content {
  background-color: white;
  border-radius: 10px;
  top: 4px;
}
.search-any {
  background-color: white;
  border-radius: 10px;
  top: 6px;
}
.selected-category {
  color: white;
  font-size: 14px;
  font-weight: bold;
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
  border-radius: 28px;
}
.scroll-container {
  height: 540px;
  overflow-y: auto;
  scrollbar-width: thin;
  top: 72px;
  z-index: 1;
  margin: 0 auto;
}
.scroll-container::-webkit-scrollbar {
  width: 0px;
}
.scroll-container::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 4px;
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
