<template>
  <div class="error">
    <div class="error-wrapper">
      <p>Yikes! What happend here?</p>
      <div class="error-data">
        <h2>{{ error.statusCode }}</h2>
        <div class="message">{{ error.message }}</div>
      </div>
      <button @click="handleError">🚀 Back to Safety!</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true,
  },
});

const handleError = () => clearError({ redirect: "/" });
</script>

<style lang="scss">
.error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .error-wrapper {
    display: flex;
    flex-direction: column;
    padding: 40px;
    border-radius: 8px;
    gap: 30px;

    p {
      color: #ffffff80;
      font-size: 18px;
    }

    .error-data {
      display: flex;
      align-items: end;
      gap: 20px;
      line-height: 0.7;

      h2 {
        font-size: 60px;
      }

      .message {
        color: #ff6666;
        font-size: 20px;
      }
    }

    button {
      width: 240px;
      padding: 14px;
      padding-inline: 10px;
      border-radius: 12px;
      border: none;
      transition: 0.2s ease-in-out;
      cursor: pointer;
      font-weight: bold;
      font-size: 18px;
      letter-spacing: -1px;
      word-spacing: 1px;
      user-select: none;
      border: 1px solid #ffffff10;
      background-color: transparent;
      outline: none;
      color: #ffffffbb;

      &:hover {
        border: 1px solid #ffffff20;
        background-color: #ffffff10;
        color: #ffffffff;
      }
    }
  }
}
</style>
