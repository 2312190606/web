import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../pages/WelcomePage.vue';
import ChatRoomPage from '../pages/ChatRoomPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomePage,
    },
    {
      path: '/chat/:roomId',
      name: 'chat',
      component: ChatRoomPage,
    },
  ],
});

export default router;
