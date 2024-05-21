<template>
  <span class="text" v-html="data.content.trim()">
  </span>
</template>

<script lang="ts">
import type { TextBlock } from "~/types/types";

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<TextBlock>,
      required: true,
    },
  },
});
</script>

<style></style>
