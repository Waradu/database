import type { Database, Tables, TablesUpdate } from "~/types/database.types";
import type { DatabaseStore } from "~/types/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const useDatabaseStore = defineStore("databaseStore", {
  state: () =>
    ({
      fetched: false,
      tables: [],
      rows: [],
      tags: [],
      row_tag: [],
      table_tag: [],
    } as DatabaseStore),

  actions: {
    async fetchData() {
      if (this.fetched) return;

      await Promise.all([this.setTables(), this.setRows(), this.setTags()]);

      this.fetched = true;
    },
    async setTables() {
      const supabase: SupabaseClient<Database> = useSupabaseClient<Database>();

      const [tables, table_tag] = await Promise.all([
        supabase.from("tables").select("*").order("id").returns<Tables<"tables">[]>(),
        supabase.from("table_tag").select("*").order("id").returns<Tables<"table_tag">[]>(),
      ]);

      if (!tables.data || !table_tag.data) return;

      this.tables = tables.data;
      this.table_tag = table_tag.data;
    },
    async setRows() {
      const supabase: SupabaseClient<Database> = useSupabaseClient<Database>();

      const [rows, row_tag] = await Promise.all([
        supabase
          .from("rows")
          .select("*")
          .order("id")
          .returns<Tables<"rows">[]>(),
        supabase.from("row_tag").select("*").order("id").returns<Tables<"row_tag">[]>(),
      ]);

      if (!rows.data || !row_tag.data) return;

      this.rows = rows.data;
      this.row_tag = row_tag.data;
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
      return this.tables.find(table => table.id === id);
    },
    getRow(id: number): Tables<"rows"> | undefined {
      return this.rows.find(row => row.id === id);
    },
    getTag(id: number): Tables<"tags"> | undefined {
      return this.tags.find(tag => tag.id === id);
    },
    getTableRows(table_id: number): Tables<"rows">[] | undefined {
      return this.rows.filter(row => row.table_id === table_id);
    },
    getTableTags(table_id: number): Tables<"tags">[] | undefined {
      const tagIds = this.table_tag.filter(tt => tt.table_id === table_id).map(tt => tt.tag_id);
      if (!tagIds) return;
      return this.tags.filter(tag => tagIds.includes(tag.id));
    },
    getRowTags(row_id: number): Tables<"tags">[] | undefined {
      const tagIds = this.row_tag.filter(rt => rt.row_id === row_id).map(rt => rt.tag_id);
      if (!tagIds) return;
      return this.tags.filter(tag => tagIds.includes(tag.id));
    },
  },
});
