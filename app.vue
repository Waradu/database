<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toast />
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
