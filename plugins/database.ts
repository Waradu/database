import type { Database } from "~/types/database.types";
import type { Block, DataTable } from "~/types/types";

export default defineNuxtPlugin((nuxtApp) => {
  const supabase = useSupabaseClient<Database>();
  const store = useDatabaseStore();

  const database = {
    async fetchRowContent(rowId: number): Promise<Block[] | undefined> {
      if (rowId == 0) return [];

      const article = await supabase
        .from("data")
        .select("*")
        .eq("row_id", rowId)
        .returns<DataTable[]>()
        .single();

      if (!article.data) return;
      if (!article.data.content) return;

      return article.data.content.blocks;
    },
    formatDate(dateStr: string) {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = `'${date.getFullYear().toString().slice(2)}`;

      return `${month} ${day} ${year}`;
    },
    async deleteTag(id: Number): Promise<{ error: any; }> {
      const { error } = await supabase.from("tags").delete().eq("id", id);
      if (error) return error;
      const { error: row_tag_error } = await supabase.from("row_tag").delete().eq("tag_id", id);
      if (row_tag_error) return row_tag_error;
      const { error: table_tag_error } = await supabase.from("table_tag").delete().eq("tag_id", id);
      if (table_tag_error) return table_tag_error;
      return { error: null };
    },
  };

  return {
    provide: {
      database,
    },
  };
});
