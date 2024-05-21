<template>
  <div
    class="overlay"
    @click="close"
    :class="{ hidden: !overlay.isOverlayVisible }"
  >
    <div class="overlay-inner">
      <form @submit.prevent="save" @click.stop v-if="formData">
        <h1>Tag</h1>
        <div class="input name">
          <label for="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            v-model="formData.name"
            required
          />
        </div>
        <div
          class="input color"
          v-if="
            overlay.currentType === 'tags' && formData && 'color' in formData
          "
        >
          <label for="color">Color:</label>
          <div class="selected-wrapper">
            <input
              type="text"
              name="color"
              id="color"
              pattern="^#([0-9A-Fa-f]{6})$"
              v-model="formData.color"
              required
            />
            <div class="tag-color" :style="{ '--color': formData.color }"></div>
          </div>
        </div>
        <div
          class="input date"
          v-if="
            overlay.currentType === 'rows' &&
            formData &&
            'publish_date' in formData
          "
        >
          <label for="date">Date:</label>
          <div class="selected-wrapper date-input-wrapper">
            <input
              type="date"
              name="date"
              id="date"
              v-model="formattedDate"
              required
            />
            <button
              type="button"
              class="calendar-button"
              @click="triggerDatePicker"
            >
              <Iconsax name="Calendar" size="20" class="calendar-icon" />
            </button>
          </div>
        </div>
        <div
          class="input icon"
          v-if="
            overlay.currentType === 'tables' && formData && 'icon' in formData
          "
        >
          <label for="icon">Icon:</label>
          <div class="selected-wrapper">
            <input
              type="text"
              name="icon"
              id="icon"
              v-model="formData.icon"
              required
            />
            <Iconsax :name="formData.icon" size="20" />
          </div>
        </div>
        <div class="input-sel" v-if="overlay.currentType !== 'tags'">
          <p>Tags:</p>
          <TagSelect v-model="selectedTags" :size="3" />
        </div>
        <div
          class="checkbox"
          v-if="
            overlay.currentType === 'tables' && formData && 'locked' in formData
          "
        >
          <label for="locked">Locked:</label>
          <label class="switch">
            <input
              type="checkbox"
              name="name"
              id="name"
              v-model="formData.locked"
            />
            <span class="slider"></span>
          </label>
        </div>
        <div class="space"></div>
        <button class="save" type="submit">Save</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Tables } from "~/types/database.types";
import type { AnyTable } from "~/types/types";

const overlay = useOverlayStore();
const store = useDatabaseStore();

const formData = ref<AnyTable | null>(overlay.currentData);

const selectedTags = ref<Tables<"tags">[]>([]);

const tags = computed<Tables<"tags">[]>(() => {
  if (!overlay.currentData) {
    return [];
  }

  if (overlay.currentType === "rows") {
    return store.getRowTags(overlay.currentData.id);
  } else if (overlay.currentType === "tables") {
    return store.getTableTags(overlay.currentData.id);
  } else {
    return [];
  }
});

const formattedDate = computed({
  get() {
    return formData.value && "publish_date" in formData.value
      ? formData.value.publish_date
      : "";
  },
  set(value: string) {
    if (formData.value && "publish_date" in formData.value) {
      formData.value.publish_date = value;
    }
  },
});

watch(
  () => overlay.currentData,
  (newData: AnyTable | null) => {
    if (newData) {
      formData.value = { ...newData };
      selectedTags.value = tags.value;
    } else {
      formData.value = null;
      selectedTags.value = [];
    }
  }
);

const save = () => {
  close();
};

const close = () => {
  overlay.hideOverlay();
};

const isPickerOpen = ref(false);

const triggerDatePicker = () => {
  const dateInput = document.getElementById('date') as HTMLInputElement;
  if (dateInput) {
    if (!isPickerOpen.value) {
      dateInput.showPicker();
      isPickerOpen.value = true;
    } else {
      dateInput.blur();
      isPickerOpen.value = false;
    }
  }
};

onMounted(() => {
  document.addEventListener('focusin', (event) => {
    const dateInput = document.getElementById('date');
    if (event.target !== dateInput) {
      isPickerOpen.value = false;
    }
  });
})
</script>

<style lang="scss">
.overlay {
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  background-color: #00000080;
  opacity: 1;
  pointer-events: all;
  transition: 0.2s ease-in-out;

  .overlay-inner {
    transition: 0.2s ease-in-out;
    background-color: #0c0c0c;
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 500px;
    border-left: 1px solid #ffffff20;
    box-shadow: 0 0 20px black;

    form {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 40px;
      gap: 20px;

      .selected-wrapper {
        display: flex;
        gap: 10px;
        align-items: center;

        &.date-input-wrapper {
          position: relative;

          input[type="date"] {
            padding-right: 30px;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;

            &::-webkit-inner-spin-button,
            &::-webkit-calendar-picker-indicator {
              display: none;
              -webkit-appearance: none;
            }
          }

          .calendar-button {
            position: absolute;
            right: 10px;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            color: #ffffffbb;

            .calendar-icon {
              pointer-events: none;
            }
          }
        }
      }

      .space {
        height: 100%;
      }

      .error {
        color: #ff6666aa;
      }

      .checkbox {
        display: flex;
        flex-direction: column;
        gap: 5px;

        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 26px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: transparent;
          border: 1px solid #ffffff20;
          transition: 0.2s ease-in-out;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 2px;
          bottom: 2px;
          background-color: #ffffffaa;
          -webkit-transition: 0.4s;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #ffffff40;
        }

        input:checked + .slider:before {
          -webkit-transform: translateX(23px);
          -ms-transform: translateX(23px);
          transform: translateX(23px);
        }
      }

      .input-sel {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .input {
        display: flex;
        flex-direction: column;
        gap: 5px;

        input {
          width: 100%;
          background-color: #0c0c0c;
          padding: 10px;
          border: none;
          border-radius: 4px;
          outline: none;
          border-radius: 4px;
          border: 1px solid #282828;
          color: #ffffffbb;
          transition: 0.2s ease-in-out;

          &:hover,
          &:focus {
            border: 1px solid #2f2f2f;
            background-color: #121212;
            color: #ffffffff;
          }
        }
      }

      .save {
        width: max-content;
        margin: 20px;
        padding: 10px;
        padding-inline: 50px;
        gap: 10px;
        border: 1px solid #6fff6c30;
        border-radius: 6px;
        color: #81ff8abb;
        transition: 0.2s ease-in-out;
        cursor: pointer;
        background-color: #8fff9120;

        &:hover {
          border: 1px solid #9bfc9130;
          background-color: #8fff9130;
          color: rgb(178, 255, 165);
        }
      }
    }
  }

  &.hidden {
    opacity: 0;
    pointer-events: none;

    .overlay-inner {
      right: -20px;
    }
  }
}
</style>
