import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useTabsStore = defineStore(
  'tabs',
  () => {
    const latestActiveTabs = ref<Tabs>();
    const prevActiveTabs = ref<Tabs>();
    const tabsMap = ref<Map<string, Tabs>>(new Map());
    const tabsList = ref<Tabs[]>([]);
    const tabsCount = computed(() => tabsList.value.length);

    function addTabs(tabs: Tabs) {
      // 避免重复添加已激活标签，解决历史激活标签记录错误问题
      if (latestActiveTabs.value?.path === tabs.path) return;

      // 保证标签存储一致性
      if (tabsList.value.length > tabsMap.value.size) {
        for (const item of tabsList.value) {
          tabsMap.value.set(item.path, item);
        }
      }

      if (latestActiveTabs.value) {
        latestActiveTabs.value.active = false;
        const target = tabsMap.value.get(latestActiveTabs.value.path);
        if (target) {
          target.active = false;
        }
        prevActiveTabs.value = latestActiveTabs.value;
      }

      tabsMap.value.set(tabs.path, tabs);
      tabsList.value = [...tabsMap.value.values()];
      latestActiveTabs.value = tabs;
    }

    function removeTabs(tabs: Tabs) {
      // 保证标签存储一致性
      if (tabsList.value.length > tabsMap.value.size) {
        for (const item of tabsList.value) {
          tabsMap.value.set(item.path, item);
        }
      }
      tabsMap.value.delete(tabs.path);
      tabsList.value = [...tabsMap.value.values()];
      if (tabsMap.value.size <= 0) {
        prevActiveTabs.value = undefined;
      }
    }

    function updateTabs(tabs: Tabs) {
      addTabs(tabs);
    }

    function getTabs(key: string) {
      return tabsMap.value.get(key);
    }

    return {
      tabsList,
      tabsCount,
      addTabs,
      removeTabs,
      updateTabs,
      getTabs,
      prevActiveTabs,
      latestActiveTabs
    };
  },
  {
    persist: true
  }
);
