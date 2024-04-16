import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const supabase = await serverSupabaseClient(event)

  if (!id) return;

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
    `)
    .eq('id', id).single();
  
  return { table: data };
})
