<template>
  <div class="table_id page">
    <header class="default">
      <h1>
        <div class="header-wrapper">
          <NuxtLink class="link" to="/">
            <Iconsax name="ArrowLeft" size="18" color="#ffffff80" thickness="4" />
          </NuxtLink>
          <Iconsax :name="table.icon" size="28" />
        </div>
        <div class="header-text">{{ table.name }}</div>
      </h1>
      <div class="tags">
        <div v-for="tag in databaseStore.getTableTags(table.id.toString())" :key="tag.id" class="tag"
          :style="{ '--color': tag.color + '50', '--full-color': tag.color + '80' }">
          {{ tag.name }}
        </div>
      </div>
    </header>
    <div class="container">
      <div class="search">
        <div class="searchbar">
          <Iconsax name="SearchNormal" size="18" color="#ffffff30" />
          <input type="text" placeholder="Search Rows for Name or Tag" v-model="search">
        </div>
      </div>
      <div class="content" v-if="filteredRows.length <= 0">
        <div class="data">
          <Iconsax name="CloseCircle" color="#ffffff30" size="18" />
          <div class="name">Nothing found</div>
        </div>
      </div>
      <NuxtLink class="content" v-for="(row, index) in filteredRows" :key="row.id" :to="`/rows/${row.id}`">
        <div class="data">
          <div class="number">{{ index + 1 }}.</div>
          <div class="name">{{ row.name }}</div>
          <div class="date">{{ formatDate(row.publish_date) }}</div>
        </div>
        <div class="info">
          <div class="tags">
            <div v-for="tag in databaseStore.getRowTags(row.id.toString())" :key="tag.id" class="tag"
              :style="{ '--color': tag.color + '50', '--full-color': tag.color + '80' }">
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
    row.name.toLowerCase().includes(searchText) ||
    databaseStore.getRowTags(row.id.toString()).some(tag => tag.name.toLowerCase().includes(searchText))
  );
});

function formatDate(dateStr: string) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = `'${date.getFullYear().toString().slice(2)}`;

    return `${month} ${day} ${year}`;
}

useHead({
  title: `Table: ${table.value?.name || 'Loading...'}`
});
</script>

<style lang="scss">
/* no styles */
</style>