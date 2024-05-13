import type { Database } from "~/types/database.types";
import type { Block, DataTable } from "~/types/types";

export default defineNuxtPlugin((nuxtApp) => {
  const supabase = useSupabaseClient<Database>();
  const store = useDatabaseStore();
  
  const database = {
    async fetchRowContent(rowId: string): Promise<Block[] | undefined> {
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
  }
  
  return {
    provide: {
      database,
    },
  };
});