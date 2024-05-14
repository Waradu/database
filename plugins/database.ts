import type { Database } from "~/types/database.types";
import type { Block, DataTable } from "~/types/types";

export default defineNuxtPlugin((nuxtApp) => {
  const supabase = useSupabaseClient<Database>();
  const store = useDatabaseStore();

  const database = {
    async fetchRowContent(rowId: number): Promise<Block[] | undefined> {
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
  };

  return {
    provide: {
      database,
    },
  };
});
