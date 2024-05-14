<template>
  <div class="table_id page">
    <header class="default">
      <h1>
        <div class="header-wrapper">
          <NuxtLink class="link" to="/">
            <Iconsax
              name="ArrowLeft"
              size="18"
              color="#ffffff80"
              thickness="3"
            />
          </NuxtLink>
          <Iconsax :name="table.icon" size="28" />
        </div>
        <div class="header-text">{{ table.name }}</div>
      </h1>
      <div class="tags">
        <div
          v-for="tag in store.getTableTags(table.id)"
          :key="tag.id"
          class="tag"
          :style="{
            '--color': tag.color + '50',
            '--full-color': tag.color + '80',
          }"
        >
          {{ tag.name }}
        </div>
      </div>
    </header>
    <div class="container">
      <div class="search">
        <div class="searchbar">
          <Iconsax name="SearchNormal" size="18" color="#ffffff30" />
          <input
            type="text"
            placeholder="Search Rows for Name or Tag"
            v-model="search"
          />
        </div>
      </div>
      <div class="content" v-if="rows.length <= 0">
        <div class="data">
          <Iconsax name="CloseCircle" color="#ffffff30" size="18" />
          <div class="name">Nothing found</div>
        </div>
      </div>
      <NuxtLink
        class="content"
        v-for="(row, index) in rows"
        :key="row.id"
        :to="`/rows/${row.id}`"
      >
        <div class="data">
          <div class="number">{{ index + 1 }}.</div>
          <div class="name">{{ row.name }}</div>
          <div class="date">{{ $database.formatDate(row.publish_date) }}</div>
        </div>
        <div class="info">
          <div class="tags">
            <div
              v-for="tag in store.getRowTags(row.id)"
              :key="tag.id"
              class="tag"
              :style="{
                '--color': tag.color + '50',
                '--full-color': tag.color + '80',
              }"
            >
              {{ tag.name }}
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const store = useDatabaseStore();
const toast = useToastStore();
const { $database } = useNuxtApp();

const route = useRoute();
const search = ref("");

const id = computed(() => Number(route.params.id));

const table = computed(() => {
  const data = store.getTable(id.value);

  if (!data) {
    toast.error("Error", "Table not found");
    throw createError({
      statusCode: 404,
      message: "Table not found",
      unhandled: false
    });
  }

  return data;
});

const rows = computed(() => {
  const searchText = search.value.trim().toLowerCase();
  const rows = store.getTableRows(id.value);

  if (!rows) return [];

  if (!searchText) {
    return rows;
  }

  return rows.filter((row) => {
    const inRowName = row.name.toLowerCase().includes(searchText);
    const tags = store.getRowTags(row.id);

    if (!tags) {
      return inRowName;
    }

    const inTagName = tags.some((tag) =>
      tag.name.toLowerCase().includes(searchText)
    );

    return inRowName || inTagName;
  });
});

useHead({
  title: `Table: ${table.value?.name || "Loading..."}`,
});
</script>

<style lang="scss">
/* no styles */
</style>
