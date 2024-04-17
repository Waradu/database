import type { Tables } from "~/types/database.types";

export interface RowExtend {
  title: string
  readable_publish_date: string
}

export interface DatabaseStore {
  fetched: boolean;
  tables: Record<string, Tables<"tables">>;
  rows: Record<string, Tables<"rows"> & RowExtend>;
  tags: Record<string, Tables<"tags">>;
  row_tag: Record<string, Tables<"row_tag">>;
  table_tag: Record<string, Tables<"table_tag">>;
}
