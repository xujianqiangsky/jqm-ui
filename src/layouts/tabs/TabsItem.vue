<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useTabsStore } from '@/stores/tabs';

defineProps<{
  tabs: Tabs;
}>();

defineEmits<{
  push: [tabs: Tabs];
  close: [tabs: Tabs];
}>();

const useTabs = useTabsStore();
</script>

<template>
  <div
    class="tabs-item"
    :class="{ 'is-active': tabs.active }"
    @click="$emit('push', tabs)"
    @click.middle="$emit('close', tabs)">
    <div class="tabs-item__title">{{ tabs.title }}</div>
    <div v-show="useTabs.tabsCount > 1" class="tabs-item__icon" @click="$emit('close', tabs)">
      <icon :icon="tabs.icon ?? 'ant-design:close-circle-filled'" />
    </div>
  </div>
</template>

<style scoped>
.tabs-item {
  display: flex;
  align-items: center;
  padding: 0.8em 1em;
  cursor: pointer;
  transition:
    var(--el-transition-box-shadow),
    background-color var(--el-transition-duration-fast)
      var(--el-transition-function-ease-in-out-bezier);
}

.tabs-item:hover {
  box-shadow: var(--el-box-shadow);
  background-color: var(--jqm-layout-bg-color);
}

.tabs-item.tabs-item.is-active {
  box-shadow: var(--el-box-shadow);
  background-color: var(--jqm-layout-bg-color);
}

.tabs-item.is-active .tabs-item__title {
  color: var(--el-menu-hover-text-color);
}

.tabs-item__icon {
  display: flex;
  align-items: center;
  margin-left: 1em;
  transition: var(--el-transition-color);
}

.tabs-item__icon:hover {
  color: var(--el-menu-hover-text-color);
}
</style>
