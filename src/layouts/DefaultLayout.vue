<script setup lang="ts">
import MenuVertical from './menu/MenuVertical.vue';
import MenuHorizontal from './menu/MenuHorizontal.vue';
import DefaultTabs from './tabs/DefaultTabs.vue';
import { useLayoutStore } from '@/stores/layout';
import { getMenuCache } from '@/utils/menuUtils';

const useLayout = useLayoutStore();

const menuList = getMenuCache();
</script>

<template>
  <div class="default-layout">
    <div
      class="modal-backdrop"
      :class="{ 'is-expand': useLayout.isMenuExpand }"
      @click="useLayout.collapseMenu"></div>
    <aside class="default-aside">
      <menu-vertical :menu-list="menuList"></menu-vertical>
    </aside>
    <header class="default-header">
      <menu-horizontal></menu-horizontal>
      <default-tabs></default-tabs>
    </header>
    <main class="default-main">
      <el-scrollbar>
        <div class="default-main__view">
          <router-view v-slot="{ Component }">
            <transition name="slide-fade" mode="out-in">
              <keep-alive :max="10">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </el-scrollbar>
    </main>
  </div>
</template>

<style scoped>
.default-layout {
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  background-color: var(--jqm-layout-bg-color);
}

.modal-backdrop {
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: var(--jqm-modal-bg-color);
}

.default-aside {
  display: none;
  position: fixed;
  z-index: 999;
  height: 100%;
  grid-column: 1 / 2;
  grid-row: span 2;
  border-right: var(--el-border);
  background-color: var(--jqm-aside-bg-color);
}

.modal-backdrop.is-expand,
.modal-backdrop.is-expand + .default-aside {
  display: block;
}

.default-header,
.default-main {
  grid-column: 2 / 3;
  grid-row: span 1;
}

.default-header {
  overflow: hidden;
  background-color: var(--jqm-header-bg-color);
}

.default-main {
  overflow: auto;
}

.default-main__view {
  overflow: hidden;
}

@media (min-width: 48em) {
  .default-aside {
    display: block;
    position: static;
    z-index: initial;
  }

  .modal-backdrop,
  .modal-backdrop.is-expand {
    display: none;
  }
}
</style>
