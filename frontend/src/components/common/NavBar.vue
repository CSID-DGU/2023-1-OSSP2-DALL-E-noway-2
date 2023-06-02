<script setup lang="ts">
import IconHome from '@/components/icons/IconHome.vue';
import IconGlobal from '@/components/icons/IconGlobal.vue';
import IconCalendar from '@/components/icons/IconCalendar.vue';
import IconProfile from '@/components/icons/IconProfile.vue';
import { onMounted, ref } from 'vue';
import { useMyInfoStore } from '@/stores/my.info.store';
import router from '@/router';

const { getUser } = useMyInfoStore();
const user = ref(getUser());

onMounted(async () => {
  try {
    if (user.value.userId === 0) {
      await useMyInfoStore().apiGetUser();
      user.value = getUser();
    }
  } catch (error) {
    console.log(error);
    router.push({ name: 'not-found' });
  }
});
</script>

<template>
  <div class="wrap">
    <nav>
      <RouterLink to="/home">
        <IconHome :opacity="$route.name === 'dream-diary-feed' ? 1 : 0.5" />
      </RouterLink>
      <RouterLink to="/board-list">
        <IconGlobal :opacity="$route.name === 'board-list' ? 1 : 0.5" />
      </RouterLink>
      <RouterLink to="/calendar">
        <IconCalendar :opacity="$route.name === 'calendar' ? 1 : 0.5" />
      </RouterLink>
      <!-- userId -->
      <RouterLink :to="`/profile/${user.userId}`">
        <IconProfile :opacity="$route.name === 'profile' ? 1 : 0.5" />
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: black;
  filter: var(--menu-shadow);
  z-index: 9;
  padding: 0 30px;
  user-select: none;
}

@media (min-width: 425px) {
  .wrap {
    max-width: 425px;
    left: 50%;
    transform: translateX(-50%);
  }
}

nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}
nav a {
  display: block;
  height: 100%;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
