import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Route for dream diary
    {
      path: '/',
      name: 'home',
      redirect: '/dream-diary-feed',
    },
    {
      path: '/dream-diary-feed',
      name: 'dream-diary-feed',
      component: () => import('@/views/DreamDiaryFeedView.vue'),
    },
    {
      path: '/dream-diary/new',
      name: 'new-dream-diary',
      component: () => import('@/views/NewDreamDiaryView.vue'),
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
    // Route for login
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    // Route for board
    {
      path: '/board-list',
      name: 'board-list',
      component: () => import('@/views/BoardListView.vue'),
    },
    {
      path: '/board/new',
      name: 'new-board',
      component: () => import('@/views/NewBoardView.vue'),
    },
    {
      path: '/board/:boardId',
      name: 'board',
      component: () => import('@/views/BoardView.vue'),
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
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
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
    // miss match
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
});

export default router;
