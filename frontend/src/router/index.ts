import { getCookie } from '@/api/cookie';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Route for login
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    // Route for dream diary
    {
      path: '/home',
      name: 'dream-diary-feed',
      component: () => import('@/views/DreamDiaryFeedView.vue'),
    },
    {
      path: '/dream-diary/new',
      name: 'new-dream-diary',
      component: () => import('@/views/NewDreamDiaryView.vue'),
    },
    {
      path: '/dream-diary/new/generate-image',
      name: 'generate-image',
      component: () => import('@/views/GenerateImageView.vue'),
    },
    {
      path: '/dream-diary/:diaryId',
      name: 'dream-diary',
      component: () => import('@/views/DreamDiaryView.vue'),
      children: [
        {
          path: 'comment',
          // name: 'comment',
          component: () => import('@/views/CommentView.vue'),
        },
      ],
    },
    // Route for board
    {
      path: '/board-list',
      name: 'board-list',
      component: () => import('@/views/BoardListView.vue'),
    },
    {
      path: '/post/new',
      name: 'new-post',
      component: () => import('@/views/NewPostView.vue'),
    },
    {
      path: '/post/:postId',
      name: 'post',
      component: () => import('@/views/PostView.vue'),
      children: [
        {
          path: 'comment',
          name: 'comment',
          component: () => import('@/views/CommentView.vue'),
        },
      ],
    },
    // Route for calendar
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/views/CalendarView.vue'),
    },
    // Route for profile
    {
      path: '/profile/:userId',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/profile/detail',
      name: 'profile-detail',
      component: () => import('@/views/ProfileDetailView.vue'),
    },
    {
      path: '/profile/edit',
      name: 'profile-edit',
      component: () => import('@/views/ProfileEditView.vue'),
    },
    {
      path: '/profile/bookmark',
      name: 'bookmark',
      component: () => import('@/views/BookmarkView.vue'),
    },
    {
      path: '/profile/like',
      name: 'like',
      component: () => import('@/views/LikeView.vue'),
    },
    {
      path: '/profile/follow',
      name: 'follow',
      component: () => import('@/views/FollowView.vue'),
    },
    // miss match
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = getCookie();
  if (to.name !== 'login' && !token) {
    next({ name: 'login' });
    alert('로그인 정보가 유효하지 않습니다.\n다시 로그인해주세요.');
  } else {
    next();
  }
});

export default router;
