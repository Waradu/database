<template>
  <div class="index">
    <div class="tables">
      <NuxtLink class="table" v-for="table, index in tables.data" :key="table.id" :to="`/tables/${table.id}`">
        <div class="number">{{ index+1 }}.</div>
        <div class="name">{{ table.name }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Database, Tables, Enums } from "~/types/database.types";

const supabase = useSupabaseClient<Database>()

const tables = await supabase.from("tables").select("*")
</script>

<style lang="scss">
.index {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .tables {
    width: 400px;
    padding: 20px;
    border-radius: 28px;
    border: 1px solid #ffffff20;
    display: flex;
    flex-direction: column;

    .table {
      display: flex;
      gap: 10px;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #ffffff10;
      transition: .2s ease-in-out;
      cursor: pointer;
      text-decoration: none;

      &:hover {
        border: 1px solid #ffffff20;
        background-color: #ffffff10;
      }
    }
  }
}
</style>