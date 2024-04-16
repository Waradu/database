<template>
  <div class="table_id">
    <header>
      <h1>
        <NuxtLink class="link" to="/">
          <Iconsax name="ArrowLeft" size="18" color="#ffffff80" />
        </NuxtLink>
        <Iconsax :name="table.icon" size="28" />
        {{ table.name }}
      </h1>
      <div class="tags">
        <div v-for="tag in table.table_tag" :key="tag.tag_id.id" class="tag"
          :style="{ '--color': tag.tag_id.color + '60' }">
          {{ tag.tag_id.name }}
        </div>
      </div>
    </header>
    <div class="tables">
      <div class="search">
        <div class="searchbar">
          <Iconsax name="SearchNormal" size="18" color="#ffffff30" />
          <input type="text" placeholder="Search for Name or Tag" v-model="search">
        </div>
      </div>
      <div class="table" v-if="rows.length <= 0">
        <div class="data">
          <Iconsax name="CloseCircle" color="#ffffff30" size="18" />
          <div class="name">Nothing found</div>
        </div>
      </div>
      <NuxtLink class="table" v-for="row, index in rows" :key="row.id" :to="`/rows/${row.id}`">
        <div class="data">
          <div class="number">{{ index + 1 }}.</div>
          <div class="name">{{ row.title }}</div>
          <div class="date">{{ row.readable_publish_date }}</div>
        </div>
        <div class="info">
          <div class="tags">
            <div v-for="tag in row.row_tag" :key="tag.tag_id.id" class="tag"
              :style="{ '--color': tag.tag_id.color + '60' }">
              {{ tag.tag_id.name }}
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Database, Tables, Enums } from "~/types/database.types";

const route = useRoute()

const search = ref("");
const allRows = ref<Tables<'rows'>[]>([
  {
    readable_publish_date: "",
    title: "Loading...",
  }
]);
const rows = ref<Tables<'rows'>[]>([
  {
    readable_publish_date: "",
    title: "Loading...",
  }
]);
const table = ref<Tables<'tables'>>({ icon: "CloseCircle", id: 0, locked: false, name: "Loading..." });

const fetchData = async () => {
  const rows: { rows: Tables<'rows'>[] } = await $fetch(`/api/rows/${route.params.id}`)
  const table: { table: Tables<'tables'> } = await $fetch(`/api/table/${route.params.id}`)

  console.log(rows);

  const updatedRows = [];
  for (const element of rows.rows) {
    try {
      const response = await fetch(`https://dev.to/api/articles/waradu/${element.dev_post_id}`);
      const data = await response.json();
      updatedRows.push({ ...element, title: data.title, readable_publish_date: data.readable_publish_date });
    } catch (error) {
      console.error("Failed to fetch article data:", error);
      updatedRows.push(element);
    }
  }

  return { rows: updatedRows, table: table.table };
}

onMounted(async () => {
  const data = await fetchData();
  allRows.value = data.rows
  table.value = data.table
  rows.value = allRows.value;
});

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-CH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

const filterData = () => {
  const searchText = search.value.trim().toLowerCase();
  if (!searchText) {
    rows.value = allRows.value;
    return;
  }
  rows.value = allRows.value.filter(row =>
    row.title.toLowerCase().includes(searchText) ||
    row.row_tag.some(tag => tag.tag_id.name.toLowerCase().includes(searchText))
  );
};

watchEffect(filterData);

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

        .number, .date {
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