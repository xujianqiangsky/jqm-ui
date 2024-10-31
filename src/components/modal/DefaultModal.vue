<script setup lang="ts">
defineProps<{
  to?: string;
  open: boolean;
}>();
</script>

<template>
  <teleport :to="to ?? 'body'">
    <div v-if="open" class="modal">
      <slot></slot>
    </div>
  </teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background-color: var(--jqm-modal-bg-color);
}
</style>
