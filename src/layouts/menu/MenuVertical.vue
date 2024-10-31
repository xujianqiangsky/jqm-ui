<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useLayoutStore } from '@/stores/layout';
import { useRouter, type RouteRecordNameGeneric } from 'vue-router';
import MenuItem from './MenuItem.vue';
import { useTabsStore } from '@/stores/tabs';

defineProps<{
  menuList: MenuDetail[];
}>();

const useLayout = useLayoutStore();
const router = useRouter();
const useTabs = useTabsStore();

function push(name: RouteRecordNameGeneric) {
  router.push({ name });
}
</script>
<template>
  <div class="menu-container">
    <el-menu class="menu-logo" :collapse="useLayout.layout.collapse">
      <el-menu-item index="0" class="menu-logo__item">
        <el-icon class="menu-logo__icon">
          <img src="@/assets/images/logo.svg" alt="jqm logo" />
        </el-icon>
        <span class="menu-logo__title"> JQM Admin </span>
      </el-menu-item>
    </el-menu>
    <el-scrollbar>
      <el-menu
        :default-active="useTabs.latestActiveTabs?.name"
        :collapse="useLayout.layout.collapse">
        <template v-for="(menu, index) in menuList" :key="index">
          <template v-if="menu.children && menu.children.length > 0">
            <el-sub-menu :index="menu.id">
              <template #title>
                <el-icon><icon :icon="menu.icon"></icon></el-icon>
                <span>{{ menu.name }}</span>
              </template>
              <menu-item :menu-list="menu.children"></menu-item>
            </el-sub-menu>
          </template>
          <template v-else>
            <el-menu-item :index="menu.id" @click="push(menu.id)">
              <el-icon><icon :icon="menu.icon"></icon></el-icon>
              <template #title>{{ menu.name }}</template>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.menu-container {
  height: 100%;
}

.menu-logo {
  --el-menu-item-height: var(--el-menu-horizontal-height);
}

.menu-logo__icon {
  font-size: 3rem;
  margin-right: 0.5em;
}

.menu-logo__icon img {
  height: 100%;
}

.menu-logo__title {
  font-size: 1.5rem;
  font-weight: bold;
}

/* 覆盖 element plus 默认样式 */
.el-menu--vertical {
  border-right: none;
}
</style>
