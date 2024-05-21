<template>
  <div v-if="item" class="admin_row admin_grid" :class="type">
    <div class="id">{{ item.id }}</div>
    <div class="name">{{ item.name }}</div>
    <div class="color" v-if="type == 'tags'">
      {{ item.color }}
      <div class="tag-color" :style="{ '--color': item.color }"></div>
    </div>
    <div class="icon" v-if="type == 'tables'" :title="item.icon">
      <Iconsax class="icon_icon" :name="item.icon" size="20" />
      <div class="icon_name">{{ item.icon }}</div>
    </div>
    <div class="locked" v-if="type == 'tables'">
      {{ item.locked }}
    </div>
    <div class="date" v-if="type == 'rows'">
      {{ $database.formatDate(item.publish_date) }}
    </div>
    <div class="actions">
      <div class="edit action" @click="overlay.showOverlay(type, item)">
        <Iconsax name="Edit2" size="16" />
      </div>
      <div class="delete action" @click="del(item.id)">
        <Iconsax :name="confirm ? 'TickCircle' : 'Trash'" size="16" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { AnyTable, DatabaseData } from '~/types/types';

const store = useDatabaseStore();
const toast = useToastStore();
const overlay = useOverlayStore()
const { $database } = useNuxtApp();
const confirm = ref(false);

const props = defineProps({
  type: {
    type: String as PropType<DatabaseData>,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

var delete_item = async (id: Number): Promise<{ error: any }> => {
  return { error: "not implemented" };
};

const item: ComputedRef<any> = computed(() => {
  if (props.type === "tags") {
    delete_item = async (id: Number): Promise<{ error: any }> => {
      return await $database.deleteTag(id);
    };
    return store.getTag(props.id);
  } else if (props.type === "rows") {
    return store.getRow(props.id);
  } else if (props.type === "tables") {
    return store.getTable(props.id);
  }
  return;
});

async function del(id: Number) {
  if (confirm.value) {
    var name = item.value.name;
    const res = await delete_item(id);
    if (res.error) {
      toast.error("Error", res.error.message);
    }
    confirm.value = false;
    toast.success("Success", `Deleted: <strong>${name}</strong>.`);
  } else {
    confirm.value = true;
    toast.info("Are you sure?", `Click again to delete.`);
  }
}
</script>

<style lang="scss">
.admin_row {
  padding: 10px;
  padding-left: 20px;
  display: grid;
  align-items: center;
  transition: 0.2s ease-in-out;
  height: 55px;
  border-top: 1px solid #ffffff00;
  border-bottom: 1px solid #ffffff00;
  white-space: nowrap;

  &:hover {
    background-color: #ffffff07;
    border-top: 1px solid #ffffff07;
    border-bottom: 1px solid #ffffff07;

    &:nth-child(2) {
      border-top: 1px solid #ffffff00;
    }

    &:last-child {
      border-bottom: 1px solid #ffffff00;
    }
  }

  .name {
    width: calc(100% - 10px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .color {
    display: flex;
    gap: 15px;
    align-items: center;

    .tag-color {
      width: 25px;
      height: 25px;
      border-radius: 4px;
      background-color: var(--color, #ffffff);
      border: 1px solid #444;
    }
  }

  .icon {
    display: flex;
    gap: 10px;
    align-items: center;
    width: calc(100% - 10px);

    .icon_icon {
      min-width: 20px;
    }

    .icon_name {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
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

      &.delete {
        border: 1px solid #ff7f7f20;
        background-color: #ff858510;
        color: #ff8686bb;
      }

      &:hover {
        border: 1px solid #ffffff30;
        background-color: #ffffff10;
        color: #ffffffff;

        &.delete {
          border: 1px solid #ff7f7f30;
          background-color: #ff858520;
          color: #ff8686ff;
        }
      }
    }
  }
}
</style>
