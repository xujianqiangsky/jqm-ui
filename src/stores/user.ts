import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<User>();
    return { userInfo };
  },
  {
    persist: true
  }
);
