<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  name: String,
});

const icon = shallowRef("");

watchEffect(() => {
  icon.value = defineAsyncComponent(
    () => import(`./items/${props.name}.vue`)
  );
});

watch(
  () => props.name,
  () => {
    icon.value = defineAsyncComponent(
      () => import(`./items/${props.name}.vue`)
    );
  }
);
</script>

<style>

</style>