<template>
  <div class="index">
    <div class="inner">
      <h1>Tables:</h1>
      <div class="tables">
        <NuxtLink class="table" v-for="table, index in tables" :key="table.id" :to="`/tables/${table.id}`">
          <div class="data">
            <div class="number">{{ index + 1 }}.</div>
            <div class="name">{{ table.name }}</div>
          </div>
          <div class="info">
            <div class="tags">
              <div v-for="tag in table.table_tag" :key="tag.tag_id.id" class="tag"
                :style="{ '--color': tag.tag_id.color + '80' }">
                {{ tag.tag_id.name }}
              </div>
            </div>
            <Iconsax name="Lock" size="18" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Database, Tables, Enums } from "~/types/database.types";

const supabase = useSupabaseClient<Database>();

const fetchData = async () => {
  const { data, error } = await supabase
    .from('tables')
    .select(`
      *,
      table_tag!inner(
        tag_id (
          id,
          name,
          color
        )
      )
    `);
  return data;
}

const tables = await fetchData();
</script>

<style lang="scss">
.index {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .inner {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .tables {
      width: 600px;
      padding: 20px;
      gap: 20px;
      border-radius: 28px;
      border: 1px solid #ffffff20;
      display: flex;
      flex-direction: column;

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

          .number {
            color: #ffffff50;
            transition: .2s ease-in-out;
          }
        }

        .info {
          display: flex;
          align-items: center;
          gap: 20px;

          .tags {
            display: flex;
            gap: 10px;

            .tag {
              opacity: .9;
              padding: 4px;
              padding-inline: 10px;
              font-size: 11px;
              background-color: var(--color, #00000050);
              color: white;
              border-radius: 20px;
              border: 2px solid var(--color, #00000050);
            }
          }
        }

        &:hover {
          border: 1px solid #ffffff20;
          background-color: #ffffff10;
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
}
</style>