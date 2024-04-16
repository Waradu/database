<template>
  <component :is="icon" />
</template>

<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
});

const defaultIcon = defineAsyncComponent(() => import('./icons/CloseCircle.vue'));
const icon = shallowRef(defaultIcon);

watchEffect(() => {
  loadIcon(props.name);
});

watch(
  () => props.name,
  (newName, oldName) => {
    if (newName !== oldName) {
      loadIcon(newName);
    }
  }
);

function loadIcon(iconName: string) {
  icon.value = defineAsyncComponent(
    () => import(`./icons/${iconName}.vue`)
      .catch((error) => {
        console.error(`Failed to load icon ${iconName}:`, error);
        return import('./icons/CloseCircle.vue');
      })
  );
}
</script>
