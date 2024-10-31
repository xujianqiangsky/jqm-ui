import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useLayoutStore = defineStore(
  'layout',
  () => {
    const layout = ref<Layout>({
      collapse: false
    });

    const isMenuExpand = computed(() => !layout.value.collapse);

    function toggleMenu() {
      layout.value.collapse = !layout.value.collapse;
    }

    function collapseMenu() {
      layout.value.collapse = true;
    }

    function expandMenu() {
      layout.value.collapse = false;
    }

    return { layout, isMenuExpand, toggleMenu, collapseMenu, expandMenu };
  },
  {
    persist: true
  }
);
