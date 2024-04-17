<template>
  <div class="table_id page">
    <header>
      <h1>
        <NuxtLink class="link" to="/">
          <Iconsax name="ArrowLeft" size="18" color="#ffffff80" />
        </NuxtLink>
        <Iconsax :name="table.icon" size="28" />
        {{ table.name }}
      </h1>
      <div class="tags">
        <div v-for="tag in databaseStore.getTableTags(table.id.toString())" :key="tag.id" class="tag"
          :style="{ '--color': tag.color + '60' }">
          {{ tag.name }}
        </div>
      </div>
    </header>
    <div class="tables">
      <div class="search">
        <div class="searchbar">
          <Iconsax name="SearchNormal" size="18" color="#ffffff30" />
          <input type="text" placeholder="Search Rows for Name or Tag" v-model="search">
        </div>
      </div>
      <div class="table" v-if="filteredRows.length <= 0">
        <div class="data">
          <Iconsax name="CloseCircle" color="#ffffff30" size="18" />
          <div class="name">Nothing found</div>
        </div>
      </div>
      <NuxtLink class="table" v-for="(row, index) in filteredRows" :key="row.id" :to="`/rows/${row.id}`">
        <div class="data">
          <div class="number">{{ index + 1 }}.</div>
          <div class="name">{{ row.title }}</div>
          <div class="date">{{ row.readable_publish_date }}</div>
        </div>
        <div class="info">
          <div class="tags">
            <div v-for="tag in databaseStore.getRowTags(row.id.toString())" :key="tag.id" class="tag"
              :style="{ '--color': tag.color + '60' }">
              {{ tag.name }}
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const search = ref("");
const databaseStore = useDatabaseStore();

const tableId = computed(() => route.params.id as string);
const table = computed(() => {
  const data = databaseStore.getTable(tableId.value)
  if (!data) throw new Error('Table not found');
  return data;
});
const filteredRows = computed(() => {
  const searchText = search.value.trim().toLowerCase();
  if (!searchText) {
    return databaseStore.getTableRows(tableId.value);
  }
  return databaseStore.getTableRows(tableId.value).filter(row =>
    row.title.toLowerCase().includes(searchText) ||
    databaseStore.getRowTags(row.id.toString()).some(tag => tag.name.toLowerCase().includes(searchText))
  );
});

useHead({
  title: `Table: ${table.value?.name || 'Loading...'}`
});
</script>

<style lang="scss">
.table_id {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 80px;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h1 {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
      display: flex;
      align-items: center;
      gap: 10px;

      .link {
        margin-right: 20px;
      }
    }

    .tags {
      display: flex;
      gap: 10px;
      align-items: center;
      user-select: none;

      .tag {
        opacity: .9;
        padding: 4px;
        height: max-content;
        padding-inline: 10px;
        font-size: 12px;
        background-color: var(--color, #ffffff60);
        color: white;
        border-radius: 20px;
        border: 2px solid var(--color, #ffffff60);
      }
    }
  }

  .tables {
    padding: 20px;
    gap: 20px;
    border-radius: 28px;
    border: 1px solid #ffffff20;
    display: flex;
    flex-direction: column;

    .search {
      width: 100%;
      display: flex;
      align-items: center;

      .searchbar {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;

        input {
          outline: none;
          border: none;
          background-color: transparent;
          font-size: 16px;
          color: #ffffff50;
          width: 100%;
          padding: 1px;
          padding-inline: 0;

          &::placeholder {
            color: #ffffff20;
          }
        }
      }
    }

    .table {
      display: flex;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #ffffff10;
      transition: .2s ease-in-out;
      cursor: pointer;
      text-decoration: none;
      color: #ffffff80;
      gap: 20px;
      justify-content: space-between;
      align-items: center;
      user-select: none;

      .data {
        display: flex;
        gap: 10px;

        .number,
        .date {
          color: #ffffff30;
        }

        .name {
          display: flex;
          align-items: center;
        }
      }

      .info {
        display: flex;
        align-items: center;
        gap: 10px;

        .tags {
          display: flex;
          gap: 10px;

          .tag {
            opacity: .9;
            padding: 4px;
            padding-inline: 10px;
            font-size: 12px;
            background-color: var(--color, #ffffff60);
            color: white;
            border-radius: 20px;
            border: 2px solid var(--color, #ffffff60);
          }
        }

        .icon {
          display: flex;
          align-items: center;
        }
      }

      &:hover {
        border: 1px solid #ffffff20;
        background-color: #ffffff05;
        color: #ffffffff;
      }
    }
  }
}
</style>