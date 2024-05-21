<template>
  <div class="admin_table">
    <div class="data header admin_grid" :class="type">
      <div class="id">ID</div>
      <div class="name">Name</div>
      <div class="color" v-if="type == 'tags'">Color</div>
      <div class="icon" v-if="type == 'tables'">Icon</div>
      <div class="locked" v-if="type == 'tables'">Locked</div>
      <div class="date" v-if="type == 'rows'">Date</div>
      <div class="actions">Actions</div>
    </div>
    <div class="data">
      <template v-for="item in items" :key="item.id">
        <AdminRow :type="type" :id="item.id" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DatabaseData } from '~/types/types';

const store = useDatabaseStore();

const props = defineProps({
  type: {
    type: String as PropType<DatabaseData>,
    required: true,
  },
});

const items = computed(() => {
  if (props.type === "tags") {
    return store.getTags();
  } else if (props.type === "rows") {
    return store.getRows();
  } else if (props.type === "tables") {
    return store.getTables();
  }
  return [];
});
</script>

<style lang="scss">
.admin_table {
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
    padding: 15px;
    padding-left: 20px;
    display: grid;
  }

  .actions {
    justify-self: end;
  }

  .admin_grid {
    &.tags {
      grid-template-columns: 50px calc(100% - 270px) 120px 100px;
    }

    &.tables {
      grid-template-columns: 50px calc(80% - 230px) 20% 80px 100px;
    }

    &.rows {
      grid-template-columns: 50px calc(75% - 150px) 25% 100px;
    }
  }
}

@media (max-width: 600px) {
  .admin_table {
    border: 1px solid #ffffff00;
    border-radius: 0px;
  }
}
</style>
