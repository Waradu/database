import type { Database, Tables } from "~/types/database.types";
import type { DatabaseStore, RowExtend } from "~/types/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const useDatabaseStore = defineStore("databaseStore", {
  state: () =>
    ({
      fetched: false,
      tables: {},
      rows: {},
      tags: {},
      row_tag: {},
      table_tag: {},
    } as DatabaseStore),

  actions: {
    async fetchData() {
      if (this.fetched) return;

      const supabase: SupabaseClient<Database> = useSupabaseClient<Database>();

      await Promise.all([
        this.setTables(supabase),
        this.setRows(supabase),
        this.setTags(supabase),
      ]);

      this.fetched = true;
    },
    async setTables(supabase: SupabaseClient<Database>) {
      if (!supabase) return;

      const [tables, table_tag] = await Promise.all([
        supabase.from("tables").select("*").returns<Tables<"tables">[]>(),
        supabase.from("table_tag").select("*").returns<Tables<"table_tag">[]>(),
      ]);

      if (!tables.data) return;

      tables.data.forEach((table) => {
        this.tables[table.id] = table;
      });

      if (table_tag.data) {
        table_tag.data.forEach((tag) => {
          this.table_tag[tag.id] = tag;
        });
      }
    },
    async setRows(supabase: SupabaseClient<Database>) {
      if (!supabase) return;

      const [rows, row_tag] = await Promise.all([
        supabase
          .from("rows")
          .select("*")
          .order("pos", { ascending: true })
          .returns<Tables<"rows">[]>(),
        supabase.from("row_tag").select("*").returns<Tables<"row_tag">[]>(),
      ]);

      if (!rows.data) return;

      rows.data.forEach((row, index) => {
        this.rows[row.id] = row as Tables<"rows"> & RowExtend;
      });

      if (row_tag.data) {
        row_tag.data.forEach((tag) => {
          this.row_tag[tag.id] = tag;
        });
      }
    },
    async setTags(supabase: SupabaseClient<Database>) {
      if (!supabase) return;

      const tags = await supabase
        .from("tags")
        .select("*")
        .returns<Tables<"tags">[]>();

      if (!tags.data) return;

      tags.data.forEach((tag) => {
        this.tags[tag.id] = tag;
      });
    },
    getTables() {
      return this.tables;
    },
    getTable(tableId: string) {
      if (!this.tables[tableId]) return;
      return this.tables[tableId];
    },
    getTableTags(tableId: string) {
      const associatedTags = Object.values(this.table_tag)
        .filter((tt) => tt.table_id === parseInt(tableId))
        .map((tt) => this.tags[tt.tag_id]);
      return associatedTags;
    },
    getTableRows(tableId: string) {
      const associatedRows = Object.values(this.rows).filter(
        (row) => row.table_id === parseInt(tableId)
      );
      return associatedRows;
    },
    getRowTags(rowId: string) {
      const tagIds = Object.values(this.row_tag).filter(
        (rt) => rt.row_id === parseInt(rowId)
      );
      return tagIds.map((rt) => this.tags[rt.tag_id]);
    },
    getRow(rowId: string) {
      if (!this.rows[rowId]) return;
      return this.rows[rowId];
    },
    async fetchRowContent(rowId: string) {
      if (!this.rows[rowId]) return;
      const data = await fetch(
        `https://dev.to/api/articles/waradu/${this.rows[rowId].dev_post_id}`
      );
      const jsondata = await data.json();
      return jsondata.body_html;
    },
  },
});
