<template>
  <div class="tag-selector" :class="{ open: open }" @click="open = !open">
    <div class="selected">
      <div class="tags" v-for="tag in internalSelected.slice(0, size)">
        <div
          class="tag"
          :style="{
            '--color': tag.color + '50',
            '--full-color': tag.color + '80',
          }"
        >
          {{ tag.name }}
        </div>
      </div>
      <div class="count">
        {{
          internalSelected.length > 0
            ? internalSelected.length > size
              ? "+" + (internalSelected.length - size)
              : ""
            : "No Tags selected"
        }}
      </div>
      <div class="space"></div>
      <Iconsax
        :name="open ? 'ArrowUp2' : 'ArrowDown2'"
        size="16"
        class="arrow"
      />
    </div>
    <div class="selector" @click.stop>
      <label
        class="sel-label"
        v-for="tag in tags"
        :key="tag.id"
        :style="{
          '--color': tag.color,
        }"
      >
        <input
          type="checkbox"
          :value="tag"
          v-model="internalSelected"
          @change="handleCheckboxChange"
        />
        {{ tag.name }}
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Tables } from '~/types/database.types';

const open = ref(false);

const props = defineProps({
  modelValue: {
    type: Array as PropType<Tables<'tags'>[]>,
    default: () => [],
  },
  tags: {
    type: Array as PropType<Tables<'tags'>[]>,
    default: () => [],
  },
  size: {
    type: Number,
    default: 2,
  },
});

const emits = defineEmits(["update:modelValue"]);

const internalSelected = ref<Tables<'tags'>[]>([...props.modelValue]);

watchEffect(() => {
  internalSelected.value = [...props.modelValue];
});

const handleCheckboxChange = () => {
  emits("update:modelValue", internalSelected.value);
};

const handleClickOutside = (event: MouseEvent) => {
  if (event.target && !(event.target as Element).closest(".tag-selector")) {
    open.value = false;
  }
};

onMounted(() => {
  document.addEventListener("mouseup", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mouseup", handleClickOutside);
});
</script>

<style lang="scss">
.tag-selector {
  position: relative;
  width: 100%;
  background-color: #0c0c0c;
  padding-inline: 10px;
  min-height: 40px;
  height: 40px;
  outline: none;
  display: flex;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #282828;
  color: #ffffffbb;
  transition: 0.2s ease-in-out;
  user-select: none;

  &:not(:has(.selector:hover)):hover {
    border: 1px solid #2f2f2f;
    background-color: #121212;
    color: #ffffffff;
  }

  .count {
    white-space: nowrap;
    font-size: 14px;
    color: #ffffffbb;
  }

  .arrow {
    min-width: 16px;
  }

  .selected {
    display: flex;
    gap: 10px;
    align-items: center;
    width: 100%;

    .tags {
      display: flex;
      gap: 10px;
      align-items: center;
      user-select: none;
      flex-wrap: wrap;

      .tag {
        opacity: 0.9;
        padding: 4px;
        height: max-content;
        padding-inline: 10px;
        font-size: 10px;
        background-color: var(--color, #ffffff60);
        color: white;
        border-radius: 20px;
        border: 2px solid var(--full-color, #ffffff60);
      }
    }

    .space {
      width: 100%;
    }
  }

  .selector {
    z-index: 100;
    position: absolute;
    opacity: 0;
    height: 0;
    left: -1px;
    width: calc(100% + 2px);
    pointer-events: none;
    display: flex;
    flex-direction: column;
    top: 45px;
    background-color: #0c0c0c;
    outline: none;
    border-radius: 4px;
    border: 1px solid #282828;
    color: #ffffffbb;
    transition: 0.2s ease-in-out;
    overflow: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0px;
    }

    .sel-label {
      width: 100%;
      padding: 10px;
      display: flex;
      gap: 10px;
      align-items: center;
      border-top: 1px solid #ffffff00;
      border-bottom: 1px solid #ffffff00;
      color: #ffffffaa;
      transition: .1s ease-in-out;

      &:has(:checked) {
        color: #ffffff;
      }

      input[type="checkbox"] {
        appearance: none;
        background-color: transparent;
        margin: 0;
        font: inherit;
        color: currentColor;
        width: 13px;
        height: 13px;
        border: 1px solid currentColor;
        border-radius: 2px;
        transform: translateY(-0.075em);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: .1s ease-in-out;

        &::before {
          content: "";
          display: block;
          width: calc(100% - 2px);
          height: calc(100% - 2px);
          scale: 0;
          transition: .1s ease-in-out;
          transform-origin: center center;
          background-color: var(--color);
        }

        &:checked {
          &::before {
            scale: 1;
          }
        }
      }

      &:hover {
        background-color: #ffffff07;
        border-top: 1px solid #ffffff07;
        border-bottom: 1px solid #ffffff07;

        &:first-child {
          border-top: 1px solid #ffffff00;
        }

        &:last-child {
          border-bottom: 1px solid #ffffff00;
        }
      }
    }
  }

  &.open {
    .selector {
      position: absolute;
      opacity: 1;
      height: 200px;
      pointer-events: all;
    }
  }
}
</style>
