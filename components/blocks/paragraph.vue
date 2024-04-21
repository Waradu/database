<template>
  <p class="paragraph">
    <template v-for="text in data.children">
      <Block type="text" :data="text" />
    </template>
  </p>
</template>

<script lang="ts">
import type { ParagraphBlock } from "~/types/types";

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<ParagraphBlock>,
      required: true,
    },
  },
});
</script>

<style></style>
