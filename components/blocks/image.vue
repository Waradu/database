<template>
  <div class="image-wrapper">
    <img class="image" :src="data.src" :alt="data.alt" />
  </div>
</template>

<script lang="ts">
import type { ImageBlock } from "~/types/types";

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<ImageBlock>,
      required: true,
    },
  },
});
</script>

<style></style>
