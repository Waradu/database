<template>
  <div class="toasts">
    <div
      class="toast"
      v-for="toast in store.getToasts()"
      :key="toast.id"
      @click="store.remove(toast.id)"
      :class="'type-' + toast.type"
    >
      <Iconsax size="26" class="icon" :name="store.getIcon(toast.type)" />
      <div class="text">
        <div class="title" v-html="toast.title"></div>
        <div class="message" v-html="toast.message"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const store = useToastStore();
</script>

<style lang="scss">
.toasts {
  position: fixed;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 10000;
  align-items: end;

  .toast {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
    background-color: #0c0c0c;
    border: 1px solid #ffffff20;
    border-radius: 8px;
    padding-inline: 15px;
    cursor: pointer;
    user-select: none;
    overflow: hidden;
    transform-origin: center bottom;
    animation: toast 6s ease-in-out 1 forwards;
    width: max-content;

    &.type-success {
      background-color: #1c2a1c;
      border: 1px solid #466846;
      color: #a7f09b;
      transition: .2s ease-in-out;

      &:hover {
        background-color: #263826;
        border: 1px solid #547c54;
        color: #bafdb0;
      }
    }

    &.type-error {
      background-color: #2a1c1c;
      border: 1px solid #684646;
      color: #f09b9b;
      transition: .2s ease-in-out;

      &:hover {
        background-color: #382626;
        border: 1px solid #7c5454;
        color: #fdb0b0;
      }
    }

    &.type-info {
      background-color: #2a2a1c;
      border: 1px solid #686546;
      color: #f0e39b;
      transition: .2s ease-in-out;

      &:hover {
        background-color: #383426;
        border: 1px solid #7c7654;
        color: #fdebb0;
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      width: 100%;
      white-space: nowrap;

      .title {
        font-size: 18px;
      }

      .message {
        font-size: 14px;
      }
    }
  }
}

@keyframes toast {
  0% {
    height: 0px;
    opacity: 0;
    scale: 0;
    translate: 0px 0;
    margin-top: -20px;
  }

  5% {
    height: 60px;
    opacity: 1;
    scale: 1;
    translate: 0px 0;
    margin-top: 20px;
  }

  93% {
    height: 60px;
    opacity: 1;
    scale: 1;
    translate: 0px 0;
    margin-top: 20px;
  }

  95% {
    height: 60px;
    opacity: 1;
    scale: .8;
    translate: 0px 0;
    margin-top: 20px;
  }

  100% {
    height: 60px;
    opacity: 0;
    scale: 1;
    translate: 400px 0;
    margin-top: 20px;
  }
}
</style>
