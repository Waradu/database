<template>
  <component class="list" :is="data.type == 'ordered' ? 'ol' : 'ul'">
    <li v-for="comp in data.children">
      <Block :type="comp.type" :data="comp.data" />
    </li>
  </component>
</template>

<script lang="ts">
import type { ListBlock } from "~/types/types";

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<ListBlock>,
      required: true,
    },
  },
});
</script>

<style></style>
