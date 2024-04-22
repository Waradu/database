<template>
  <div class="admin-tags">
    <div class="data-table">
      <div class="data header">
        <div class="id">ID</div>
        <div class="name">Name</div>
        <div class="color">Color</div>
        <div class="actions">Actions</div>
      </div>
      <div class="data" v-for="tag in tags">
        <div class="id">{{ tag.id }}</div>
        <div class="name">{{ tag.name }}</div>
        <div class="color">
          {{ tag.color }}
          <div class="tag-color" :style="{ '--color': tag.color }"></div>
        </div>
        <div class="actions">
          <div class="edit action" @click="edit(tag.id)">
            <Iconsax name="Edit2" size="16" />
          </div>
          <div class="delete action" @click="delete_item(tag.id)">
            <Iconsax name="Trash" size="16" />
          </div>
        </div>
      </div>
    </div>
    <div
      class="overlay"
      @click="selected_tag.id = 0"
      :class="{ hidden: selected_tag.id == 0 }"
    >
      <div class="overlay-inner" @click.stop>
        <h1>Edit Tag</h1>
        <div class="input name">
          <label for="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            v-model="selected_tag.name"
          />
        </div>
        <div class="input color">
          <label for="color">Color:</label>
          <input
            type="text"
            name="color"
            id="color"
            v-model="selected_tag.color"
          />
        </div>
        <div class="space"></div>
        <button class="save" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Database, Tables } from "~/types/database.types";

const databaseStore = useDatabaseStore();
const tags = ref(databaseStore.getTags())
const supabase = useSupabaseClient<Database>();
const selected_tag = ref<Tables<"tags">>({
  id: 0,
  name: "",
  color: "",
});

function edit(tag_id: number) {
  const tag = databaseStore.getTag(tag_id.toString());

  if (!tag) return;

  selected_tag.value.id = tag.id;
  selected_tag.value.name = tag.name;
  selected_tag.value.color = tag.color;
}

function delete_item(tag_id: number) {}

async function save() {
  if (selected_tag.value.id == 0) return;
  const { data, error } = await supabase
    .from("tags")
    .update({ name: selected_tag.value.name, color: selected_tag.value.color })
    .eq("id", selected_tag.value.id);
  if (error) {
    console.log(error);
    return;
  }
  databaseStore.tags[selected_tag.value.id].name = selected_tag.value.name;
  databaseStore.tags[selected_tag.value.id].color = selected_tag.value.color;
  tags.value = databaseStore.getTags()
  selected_tag.value.id = 0;
}

definePageMeta({
  layout: "admin",
});
</script>

<style lang="scss">
.admin-tags {
  width: 100%;
  height: 100%;
  padding: 40px;

  .data-table {
    width: 100%;
    overflow: hidden;
    overflow-y: auto;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #ffffff20;
    border-radius: 12px;
    position: relative;

    &::-webkit-scrollbar {
      width: 0px;
    }

    .header {
      border-bottom: 1px solid #ffffff20;
      position: sticky;
      top: 0;
      background-color: #0c0c0c;
    }

    .data {
      padding: 10px;
      padding-left: 20px;
      display: grid;
      grid-template-columns: 50px calc(100% - 320px) 120px 150px;
      align-items: center;
      transition: 0.2s ease-in-out;

      &.header {
        padding: 15px;
        padding-left: 20px;
      }

      &:not(.header) {
        border-top: 1px solid #ffffff00;
        border-bottom: 1px solid #ffffff00;
      }

      &:not(.header):hover {
        background-color: #ffffff10;
        border-top: 1px solid #ffffff10;
        border-bottom: 1px solid #ffffff10;

        &:nth-child(2) {
          border-top: 1px solid #ffffff00;
        }

        &:last-child {
          border-bottom: 1px solid #ffffff00;
        }
      }
    }

    .color {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .tag-color {
      width: 25px;
      height: 25px;
      border-radius: 4px;
      background-color: var(--color, #ffffff);
    }

    .actions {
      justify-self: end;
      display: flex;
      gap: 10px;

      .action {
        padding: 4px;
        font-size: 12px;
        border-radius: 8px;
        padding-inline: 8px;
        border: 1px solid #ffffff20;
        color: #ffffffbb;
        transition: 0.2s ease-in-out;
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover {
          border: 1px solid #ffffff30;
          background-color: #ffffff10;
          color: #ffffffff;
        }
      }
    }
  }

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
      width: 400px;
      border-left: 1px solid #ffffff20;
      box-shadow: 0 0 20px black;
      display: flex;
      flex-direction: column;
      padding: 20px;
      gap: 20px;

      .input {
        display: flex;
        flex-direction: column;
        gap: 5px;

        input {
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

      .space {
        height: 100%;
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

    &.hidden {
      opacity: 0;
      pointer-events: none;

      .overlay-inner {
        right: -20px;
      }
    }
  }
}
</style>
