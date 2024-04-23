<template>
  <div class="admin-tables admin-page">
    <div class="data-table">
      <div class="data header">
        <div class="id">ID</div>
        <div class="name">Name</div>
        <div class="icon">Icon</div>
        <div class="locked">Locked</div>
        <div class="actions">Actions</div>
      </div>
      <div
        class="data"
        v-if="
          Object.keys(
            Object.values(tables).filter((filter) =>
              filter.name.toLowerCase().includes(term.toLowerCase())
            )
          ).length === 0
        "
      >
        <div class="id">404</div>
        <div class="name">Nothing found</div>
        <div class="icon"></div>
        <div class="locked"></div>
        <div class="actions"></div>
      </div>
      <div
        class="data"
        v-for="object in Object.values(tables).filter((filter) =>
          filter.name.toLowerCase().includes(term.toLowerCase())
        )"
      >
        <div class="id">{{ object.id }}</div>
        <div class="name" :title="object.name">{{ object.name }}</div>
        <div class="icon">
          <Iconsax :name="object.icon" size="20" />
          {{ object.icon }}
        </div>
        <div class="locked">
          {{ object.locked }}
        </div>
        <div class="actions">
          <div class="edit action" @click="edit(object.id)">
            <Iconsax name="Edit2" size="16" />
          </div>
          <div class="delete action" @click="delete_item(object.id)">
            <Iconsax name="Trash" size="16" />
          </div>
        </div>
      </div>
    </div>
    <div class="overlay" @click="reset" :class="{ hidden: selected.id == 0 }">
      <form @submit.prevent="save" class="overlay-inner" @click.stop>
        <h1>Table</h1>
        <div class="input name">
          <label for="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            v-model="selected.name"
            required
          />
        </div>
        <div class="input icon">
          <label for="icon">Icon:</label>
          <div class="selected-wrapper">
            <input
              type="text"
              name="icon"
              id="icon"
              v-model="selected.icon"
              required
            />
            <Iconsax :name="selected.icon" size="20" />
          </div>
        </div>
        <div class="input-sel">
          <p>Tags:</p>
          <TagSelector v-model="selected.tags" :tags="availableTags" :size="parseInt('3')" />
        </div>
        <div class="checkbox locked">
          <label for="locked">Locked:</label>
          <label class="switch">
            <input
              type="checkbox"
              name="name"
              id="name"
              v-model="selected.locked"
            />
            <span class="slider"></span>
          </label>
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
const availableTags = ref(Object.values(databaseStore.getTags()));
const error_message = ref("");
const term = ref("");
const tables = ref(databaseStore.getTables());
const supabase = useSupabaseClient<Database>();
const selected = ref({
  id: 0,
  name: "",
  icon: "",
  locked: false,
  tags: [] as Tables<"tags">[],
});

function reset() {
  setTimeout(() => {
    selected.value = {
      id: 0,
      name: "",
      icon: "",
      locked: false,
      tags: [],
    };
  }, 200);
}

function edit(table_id: number) {
  const table = databaseStore.getTable(table_id.toString());

  if (!table) return;

  selected.value.id = table.id;
  selected.value.name = table.name;
  selected.value.icon = table.icon;
  selected.value.locked = table.locked;
  selected.value.tags = Object.values(
    databaseStore.getTableTags(table_id.toString())
  );
}

async function delete_item(table_id: number) {
  const shouldDelete = confirm("Are you sure?");

  if (shouldDelete) {
    const { data, error } = await supabase
      .from("tables")
      .delete()
      .eq("id", table_id);

    if (error) {
      error_message.value = error.message;
      return;
    }

    await databaseStore.setTables();
    tables.value = databaseStore.getTables();

    reset();
  }
}

async function save() {
  if (selected.value.id == 0) return;

  if (selected.value.id == -1) {
    const { data, error } = await supabase.from("tables").insert({
      name: selected.value.name,
      icon: selected.value.icon,
      locked: selected.value.locked,
    });

    if (error) {
      error_message.value = error.message;
      reset();
      return;
    }

    await databaseStore.setTables();
    tables.value = databaseStore.getTables();

    reset();

    return;
  }

  const { data, error } = await supabase
    .from("tables")
    .update({
      name: selected.value.name,
      icon: selected.value.icon,
      locked: selected.value.locked,
    })
    .eq("id", selected.value.id);
  if (error) {
    error_message.value = error.message;
    reset();
    return;
  }

  await databaseStore.setTables();
  tables.value = databaseStore.getTables();
  reset();
}

const createAction = inject("createAction") as Ref<() => void>;

createAction.value = () => {
  selected.value.id = -1;
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
.admin-tables {
  .data-table {
    .data {
      grid-template-columns: 50px calc(100% - 530px) 300px 80px 100px;
    }

    .icon {
      display: flex;
      gap: 10px;
      align-items: center;
      overflow: hidden;
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
