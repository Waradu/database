<template>
  <div class="index page">
    <header>
      <h1>Waradu's Database</h1>
      <p class="desc">
        This is my personal blog where I share tutorials and more, mostly about
        programming. Huge thanks to myself for making this website.
      </p>
      <div class="link" v-if="show_portfolio">
        <NuxtLink to="https://waradu.dev" class="website" @click="updateHref"
          >My Portfolio</NuxtLink
        >
      </div>
    </header>
    <div class="container">
      <div class="search">
        <div class="searchbar">
          <Iconsax name="SearchNormal" size="18" color="#ffffff30" />
          <input
            type="text"
            placeholder="Search Tables for Title or Tag"
            v-model="search"
          />
        </div>
      </div>
      <div class="content" v-if="tables.length <= 0">
        <div class="data">
          <Iconsax name="CloseCircle" size="18" />
          <div class="name">Nothing found</div>
        </div>
      </div>
      <NuxtLink
        class="content"
        v-for="table in tables"
        :key="table.id"
        :to="`/tables/${table.id}`"
      >
        <div class="data">
          <Iconsax :name="table.icon" color="#ffffff30" size="18" />
          <div class="name">{{ table.name }}</div>
        </div>
        <div class="info">
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
          <div class="icon" title="Finished and Archived" v-if="table.locked">
            <Iconsax name="ArchiveBox" size="18" />
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const store = useDatabaseStore();

const search = ref("");
const show_portfolio = ref(true);

onMounted(() => {
  show_portfolio.value = !window.top?.location.pathname.startsWith("/admin");
});

const tables = computed(() => {
  const searchText = search.value.trim().toLowerCase();
  const tables = store.getTables();

  if (!searchText) {
    return tables;
  }

  return tables.filter((table) => {
    const inTableName = table.name.toLowerCase().includes(searchText);
    const tags = store.getTableTags(table.id);

    if (!tags) {
      return inTableName;
    }

    const inTagName = tags.some((tag) =>
      tag.name.toLowerCase().includes(searchText)
    );

    return inTableName || inTagName;
  });
});

const updateHref = (event: MouseEvent) => {
  if (event.altKey) {
    event.stopImmediatePropagation();
    event.preventDefault();
    navigateTo("/admin");
  }
};

useHead({
  title: "Database",
});
</script>

<style lang="scss">
@import url("~/assets/pages/index.scss");
</style>
