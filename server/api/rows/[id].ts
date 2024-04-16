import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  const supabase = await serverSupabaseClient(event);

  if (!id) return;

  const { data } = await supabase
    .from("rows")
    .select(
      `
      *,
      row_tag (
        tag_id (
          id,
          name,
          color
        )
      )
    `
    )
    .order("pos")
    .eq("table_id", id);

  return { rows: data };
});
