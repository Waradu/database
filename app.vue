<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toast />
  <div class="buttons">
    <button @click="toast.success('Test', 'This is a test toast')">Success</button>
    <button @click="toast.error('Test', 'This is a test toast')">Error</button>
    <button @click="toast.info('Test', 'This is a test toast')">Info</button>
  </div>
</template>

<script lang="ts" setup>
const store = useDatabaseStore();
await store.fetchData();

const toast = useToastStore();
</script>

<style lang="scss">
@import url("~/assets/global.scss");

.buttons {
  position: fixed;
  top: 10px;
  left: 10px;
  gap: 10px;
  display: flex;

  button {
    padding: 2px;
    padding-inline: 8px;
  }
}
</style>
