<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toast />
</template>

<script lang="ts" setup>
const store = useDatabaseStore();
await store.fetchData();
</script>

<style lang="scss">
@import url("~/assets/global.scss");
</style>
