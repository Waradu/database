<template>
  <component class="heading" :is="'h' + data.size">
      {{ data.content }}
    </component>
</template>

<script lang="ts">
import type { HeadingBlock } from '~/types/types';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<HeadingBlock>,
      required: true
    }
  },
})
</script>

<style>

</style>