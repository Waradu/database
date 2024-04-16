<template>
  <component :is="icon" />
</template>

<script lang="ts" setup>
const props = defineProps({
  name: String,
});

const icon = shallowRef("");

watchEffect(() => {
  icon.value = defineAsyncComponent(
    () => import(`./icons/${props.name}.vue`)
  );
});

watch(
  () => props.name,
  () => {
    icon.value = defineAsyncComponent(
      () => import(`./icons/${props.name}.vue`)
    );
  }
);
</script>