<template>
  <div class="index page">
    <header>
      <h1>Waradu's Database</h1>
      <p class="desc">I make tutorials (mostly programming) cuz why not. Huge thanks to myself for
        making this website.</p>
      <div class="link" v-if="show_portfolio">
        <NuxtLink to="https://waradu.dev" class="website" @click="updateHref">My Portfolio</NuxtLink>
      </div>
    </header>
    <div class="container">
      <div class="search">
        <div class="searchbar">
          <Iconsax name="SearchNormal" size="18" color="#ffffff30" />
          <input type="text" placeholder="Search Tables for Title or Tag" v-model="search">
        </div>
      </div>
      <div class="content" v-if="filteredTables.length <= 0">
        <div class="data">
          <Iconsax name="CloseCircle" size="18" />
          <div class="name">Nothing found</div>
        </div>
      </div>
      <NuxtLink class="content" v-for="table in filteredTables" :key="table.id" :to="`/tables/${table.id}`">
        <div class="data">
          <Iconsax :name="table.icon" color="#ffffff30" size="18" />
          <div class="name">{{ table.name }}</div>
        </div>
        <div class="info">
          <div class="tags">
            <div v-for="tag in databaseStore.getTableTags(table.id.toString())" :key="tag.id" class="tag"
              :style="{ '--color': tag.color + '50', '--full-color': tag.color + '80' }">
              {{ tag.name }}
            </div>
          </div>
          <div class="icon" title="Finished and Archived" v-if="table.locked">
            <Iconsax name="ArchiveBox" size="18" />
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const search = ref("");
const databaseStore = useDatabaseStore();
const show_portfolio = ref(true)

onMounted(() => {
  show_portfolio.value = !window.top?.location.pathname.startsWith("/admin")
}),

useHead({
  title: "Database"
});

const filteredTables = computed(() => {
  const searchText = search.value.trim().toLowerCase();
  if (!searchText) {
    return Object.values(databaseStore.getTables());
  }
  return Object.values(databaseStore.getTables()).filter(table =>
    table.name.toLowerCase().includes(searchText) ||
    databaseStore.getTableTags(table.id.toString()).some(tag => tag.name.toLowerCase().includes(searchText))
  );
});

const updateHref = (event: MouseEvent) => {
  if (event.altKey) {
    event.stopImmediatePropagation()
    event.preventDefault()
    navigateTo("/admin")
  }
};
</script>

<style lang="scss">
@import url('~/assets/pages/index.scss');
</style>