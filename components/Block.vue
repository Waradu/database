<template>
  <component :is="comp" />
</template>

<script lang="ts" setup>
const props = defineProps({
  type: String,
});

const comp = shallowRef("");

watchEffect(() => {
  comp.value = defineAsyncComponent(
    () => import(`~/components/blocks/${props.type}.vue`)
  );
});

watch(
  () => props.type,
  () => {
    comp.value = defineAsyncComponent(
      () => import(`~/components/blocks/${props.type}.vue`)
    );
  }
);
</script>

<style>

</style>