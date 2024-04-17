<template>
  <div class="index page">
    <header>
      <h1>Waradu's Database</h1>
      <p class="desc">I make programming tutorials about solutions to problems I faced myself. Huge thanks to myself for
        making this website.</p>
      <div class="link">
        <a href="https://waradu.dev" class="website">My Portfolio</a>
      </div>
    </header>
    <div class="tables">
      <div class="search">
        <div class="searchbar">
          <Iconsax name="SearchNormal" size="18" color="#ffffff30" />
          <input type="text" placeholder="Search Tables for Title or Tag" v-model="search">
        </div>
      </div>
      <div class="table" v-if="filteredTables.length <= 0">
        <div class="data">
          <Iconsax name="CloseCircle" size="18" />
          <div class="name">Nothing found</div>
        </div>
      </div>
      <NuxtLink class="table" v-for="table in filteredTables" :key="table.id" :to="`/tables/${table.id}`">
        <div class="data">
          <Iconsax :name="table.icon" color="#ffffff30" size="18" />
          <div class="name">{{ table.name }}</div>
        </div>
        <div class="info">
          <div class="tags">
            <div v-for="tag in databaseStore.getTableTags(table.id.toString())" :key="tag.id" class="tag"
              :style="{ '--color': tag.color + '60' }">
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
</script>

<style lang="scss">
.index {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 80px;

  header {
    display: grid;
    gap: 10px;
    grid-template-columns: calc(100% - 130px) 120px;

    h1 {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }

    .desc {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
      color: #ffffff80;
      font-weight: 200;
    }

    .link {
      grid-column: 2 / 3;
      grid-row: 1 / 3;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: end;

      .website {
        border-radius: 8px;
        padding: 6px;
        padding-inline: 16px;
        font-size: 14px;
        background-color: #ffffff20;
        border: 1px solid #ffffff20;
        text-decoration: none;
        color: white;
        cursor: pointer;
        transition: .2s ease-in-out;

        &:hover {
          background-color: #ffffff30;
          border: 1px solid #ffffff30;
        }
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

        .data {
          .number {
            color: #ffffff80;
          }
        }
      }
    }
  }
}
</style>