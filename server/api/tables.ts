import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const { data } = await supabase
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
  
  return { tables: data };
})
