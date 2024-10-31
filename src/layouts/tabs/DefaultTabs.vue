<script setup lang="ts">
import TabsItem from './TabsItem.vue';
import { Icon } from '@iconify/vue';
import { useResizeObserver } from '@vueuse/core';
import { nextTick, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useTabsStore } from '@/stores/tabs';

const router = useRouter();
const useTabs = useTabsStore();
const tabs = ref<HTMLDivElement>();
const arrowDisplayStatus = ref(false);

function closeTabs(tabs: Tabs) {
  useTabs.removeTabs(tabs);
  // 跳转至上一次激活的标签页
  if (tabs.active && useTabs.prevActiveTabs) {
    router.push(useTabs.prevActiveTabs.path);
  }
}

function pushTabs(tabs: Tabs) {
  router.push(tabs.path);
}

// 滚动至激活标签
function scrollToActiveTabs() {
  const tabItem = tabs.value?.querySelector('.tabs-item.is-active') as HTMLDivElement;
  tabs.value?.scrollTo({
    left: tabItem?.offsetLeft - tabItem?.offsetWidth,
    behavior: 'smooth'
  });
}

function scrollByLeft() {
  scrollByHorizontal(-(tabs.value?.clientWidth ?? 0) / 2);
}

function scrollByRight() {
  scrollByHorizontal((tabs.value?.clientWidth ?? 0) / 2);
}

function scrollByHorizontal(distance: number) {
  tabs.value?.scrollBy({
    left: distance,
    behavior: 'smooth'
  });
}

watchEffect(() => {
  if (useTabs.latestActiveTabs) {
    nextTick(() => {
      scrollToActiveTabs();
    });
  }
});

// 监听 tabs 元素尺寸变化，动态显示翻页按钮。
useResizeObserver(tabs, () => {
  if (tabs.value) {
    scrollToActiveTabs();
    arrowDisplayStatus.value = tabs.value.clientWidth < tabs.value.scrollWidth;
  }
});
</script>

<template>
  <div class="default-tabs">
    <div v-show="arrowDisplayStatus" class="default-tabs__arrow arrow-left" @click="scrollByLeft">
      <icon icon="ant-design:left-outlined" />
    </div>
    <div ref="tabs" class="default-tabs__item">
      <tabs-item
        v-for="(tabs, index) in useTabs.tabsList"
        :key="index"
        :tabs="tabs"
        @push="pushTabs"
        @close="closeTabs">
      </tabs-item>
    </div>
    <div v-show="arrowDisplayStatus" class="default-tabs__arrow arrow-right" @click="scrollByRight">
      <icon icon="ant-design:right-outlined" />
    </div>
  </div>
</template>

<style scoped>
.default-tabs {
  display: flex;
  border-bottom: var(--el-border);
}

.default-tabs__arrow {
  display: flex;
  align-items: center;
  padding: 0.8em 0.5em;
  box-shadow: var(--el-box-shadow);
  transition: background-color var(--el-transition-duration-fast)
    var(--el-transition-function-ease-in-out-bezier);
}

.default-tabs__arrow:hover {
  background-color: var(--jqm-layout-bg-color);
}

.default-tabs__item {
  position: relative;
  display: flex;
  overflow: hidden;
}

.arrow-right {
  margin-left: auto;
}
</style>
