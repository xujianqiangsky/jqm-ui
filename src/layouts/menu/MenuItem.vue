<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useRouter, type RouteRecordNameGeneric } from 'vue-router';

defineProps<{
  menuList: MenuDetail[];
}>();

const router = useRouter();

function push(name: RouteRecordNameGeneric) {
  router.push({ name });
}
</script>

<template>
  <template v-for="(menu, index) in menuList" :key="index">
    <template v-if="menu.children && menu.children.length > 0">
      <menu-item :menu-list="menu.children"></menu-item>
    </template>
    <template v-else>
      <el-menu-item :index="menu.id" @click="push(menu.id)">
        <el-icon><icon :icon="menu.icon"></icon></el-icon>
        <template #title>{{ menu.name }}</template>
      </el-menu-item>
    </template>
  </template>
</template>
