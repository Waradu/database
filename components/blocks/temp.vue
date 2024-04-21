<template>
  <div
    class="text"
    :class="[{ bold: data.bold, italic: data.italic, code: data.code }]"
  >
    {{ data.content }}
  </div>
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
