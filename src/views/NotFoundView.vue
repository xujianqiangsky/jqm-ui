<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
  router.back();
}
</script>

<template>
  <div class="container">
    <img src="@/assets/images/not-found.svg" alt="notFound" />
    <el-button type="primary" @click="goBack">返回上一级</el-button>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container img {
  width: 100%;
  height: 100%;
}

.container button {
  margin: 1em;
}
</style>
