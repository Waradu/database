import type { Database, Tables, TablesUpdate } from "~/types/database.types";
import type { DatabaseStore } from "~/types/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const useDatabaseStore = defineStore("databaseStore", {
  state: () =>
    ({
      fetched: false,
      loading: true,
      tables: [],
      rows: [],
      tags: [],
      row_tag: [],
      table_tag: [],
    } as DatabaseStore),

  actions: {
    async fetchData() {
      if (this.fetched) return;
      this.fetched = true;

      await Promise.all([
        this.setTableTags(),
        this.setRowTags(),
        this.setTables(),
        this.setRows(),
        this.setTags(),
      ]);

      this.loading = false;
    },
    async setTableTags() {
      const supabase: SupabaseClient<Database> = useSupabaseClient<Database>();

      const table_tag = await supabase
        .from("table_tag")
        .select("*")
        .order("id")
        .returns<Tables<"table_tag">[]>();

      if (!table_tag.data) return;

      this.table_tag = table_tag.data;
    },
    async setRowTags() {
      const supabase: SupabaseClient<Database> = useSupabaseClient<Database>();

      const row_tag = await supabase
        .from("row_tag")
        .select("*")
        .order("id")
        .returns<Tables<"row_tag">[]>();

      if (!row_tag.data) return;

      this.row_tag = row_tag.data;
    },
    async setTables() {
      const supabase: SupabaseClient<Database> = useSupabaseClient<Database>();

      const tables = await supabase
        .from("tables")
        .select("*")
        .order("id")
        .returns<Tables<"tables">[]>();

      if (!tables.data) return;

      this.tables = tables.data;
    },
    async setRows() {
      const supabase: SupabaseClient<Database> = useSupabaseClient<Database>();

      const rows = await supabase
        .from("rows")
        .select("*")
        .order("id")
        .returns<Tables<"rows">[]>();

      if (!rows.data) return;

      this.rows = rows.data;
    },
    async setTags() {
      const supabase: SupabaseClient<Database> = useSupabaseClient<Database>();

      const tags = await supabase
        .from("tags")
        .select("*")
        .order("id")
        .returns<Tables<"tags">[]>();

      if (!tags.data) return;

      this.tags = tags.data;
    },
    getTables(): Tables<"tables">[] {
      return this.tables;
    },
    getRows(): Tables<"rows">[] {
      return this.rows;
    },
    getTags(): Tables<"tags">[] {
      return this.tags;
    },
    getTable(id: number): Tables<"tables"> | undefined {
      return this.tables.find((table) => table.id === id);
    },
    getRow(id: number): Tables<"rows"> | undefined {
      return this.rows.find((row) => row.id === id);
    },
    getTag(id: number): Tables<"tags"> | undefined {
      return this.tags.find((tag) => tag.id === id);
    },
    getTableRows(table_id: number): Tables<"rows">[] | undefined {
      return this.rows.filter((row) => row.table_id === table_id);
    },
    getTableTags(table_id: number): Tables<"tags">[] {
      const tagIds = this.table_tag
        .filter((tt) => tt.table_id === table_id)
        .map((tt) => tt.tag_id);
      if (!tagIds) return [];
      return this.tags.filter((tag) => tagIds.includes(tag.id));
    },
    getRowTags(row_id: number): Tables<"tags">[] {
      const tagIds = this.row_tag
        .filter((rt) => rt.row_id === row_id)
        .map((rt) => rt.tag_id);
      if (!tagIds) return [];
      return this.tags.filter((tag) => tagIds.includes(tag.id));
    },
  },
});
