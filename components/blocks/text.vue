<template>
  <component
    :is="data.link != '' && data.code == false ? 'a' : 'span'"
    class="text"
    :target="data.link.startsWith('/') || !(data.link != '' && data.code == false)  ? '' : '_blank'"
    :href="data.link"
    :class="[{ bold: data.bold, italic: data.italic, code: data.code, link: data.link }]"
  >
    {{ data.content.trim() }}
  </component>
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
