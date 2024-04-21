<template>
  <pre>
    <code :class="['language-']">

    </code>
  </pre>
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
