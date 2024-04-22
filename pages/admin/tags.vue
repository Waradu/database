<template>
  <div class="admin-tags admin-page">
    <div class="data-table">
      <div class="data header">
        <div class="id">ID</div>
        <div class="name">Name</div>
        <div class="color">Color</div>
        <div class="actions">Actions</div>
      </div>
      <div
        class="data"
        v-if="
          Object.keys(
            Object.values(tags).filter((tag) =>
              tag.name.toLowerCase().includes(term.toLowerCase())
            )
          ).length === 0
        "
      >
        <div class="id">404</div>
        <div class="name">Nothing found</div>
        <div class="color"></div>
        <div class="actions"></div>
      </div>
      <div
        class="data"
        v-for="tag in Object.values(tags).filter((tag) =>
          tag.name.toLowerCase().includes(term.toLowerCase())
        )"
      >
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
      @click="reset"
      :class="{ hidden: selected_tag.id == 0 }"
    >
      <form @submit.prevent="save" class="overlay-inner" @click.stop>
        <h1>Tag</h1>
        <div class="input name">
          <label for="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            v-model="selected_tag.name"
            required
          />
        </div>
        <div class="input color">
          <label for="color">Color:</label>
          <div class="color-wrapper">
            <input
              type="text"
              name="color"
              id="color"
              pattern="^#([0-9A-Fa-f]{6})$"
              v-model="selected_tag.color"
              required
            />
            <div
              class="tag-color"
              :style="{ '--color': selected_tag.color }"
            ></div>
          </div>
        </div>
        <div class="space"></div>
        <div class="error">{{ error_message }}</div>
        <button class="save" type="submit">Save</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Database, Tables } from "~/types/database.types";

const databaseStore = useDatabaseStore();
const error_message = ref("");
const term = ref("");
const tags = ref(databaseStore.getTags());
const supabase = useSupabaseClient<Database>();
const selected_tag = ref<Tables<"tags">>({
  id: 0,
  name: "",
  color: "",
});

function reset() {
  selected_tag.value = {
    id: 0,
    name: "",
    color: "",
  };
}

function edit(tag_id: number) {
  const tag = databaseStore.getTag(tag_id.toString());

  if (!tag) return;

  selected_tag.value.id = tag.id;
  selected_tag.value.name = tag.name;
  selected_tag.value.color = tag.color;
}

async function delete_item(tag_id: number) {
  const shouldDelete = confirm("Are you sure?");

  if (shouldDelete) {
    const { data, error } = await supabase
      .from("tags")
      .delete()
      .eq("id", tag_id);

    if (error) {
      console.log(error);
      error_message.value = error.message;
      return;
    }

    await databaseStore.setTags();
    tags.value = databaseStore.getTags();

    reset();
  }
}

async function save() {
  if (selected_tag.value.id == 0) return;

  if (selected_tag.value.id == -1) {
    const { data, error } = await supabase.from("tags").insert({
      name: selected_tag.value.name,
      color: selected_tag.value.color,
    });

    if (error) {
      console.log(error);
      error_message.value = error.message;
      reset();
      return;
    }

    await databaseStore.setTags();
    tags.value = databaseStore.getTags();

    reset();

    return;
  }

  const { data, error } = await supabase
    .from("tags")
    .update({ name: selected_tag.value.name, color: selected_tag.value.color })
    .eq("id", selected_tag.value.id);
  if (error) {
    console.log(error);
    error_message.value = error.message;
    reset();
    return;
  }

  await databaseStore.setTags();
  tags.value = databaseStore.getTags();
  reset();
}

const createAction = inject("createAction") as Ref<() => void>;

createAction.value = () => {
  selected_tag.value.id = -1;
};

const searchAction = inject("searchAction") as Ref<(term: string) => void>;

searchAction.value = (search_term: string) => {
  term.value = search_term;
};

definePageMeta({
  layout: "admin",
});
</script>

<style lang="scss">
.admin-tags {
  .data-table {
    .data {
      grid-template-columns: 50px calc(100% - 320px) 120px 150px;
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
        border: 1px solid #444;
      }
  }
  .overlay {
    .color-wrapper {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .tag-color {
        min-width: 35px;
        width: 35px;
        min-height: 35px;
        height: 35px;
        border-radius: 4px;
        background-color: var(--color, #ffffff);
        border: 1px solid #444;
      }
  }
}
</style>
