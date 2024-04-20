<template>
  <div>
    
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    type: {
      type: String,
      default: "linear",
    },
    size: {
      type: [String, Number],
      default: 24,
    },
    color: {
      type: String,
      default: "currentColor",
    },
    thickness: {
      type: [String, Number],
      default: 1.5,
    }
  },
})
</script>

<style>

</style>