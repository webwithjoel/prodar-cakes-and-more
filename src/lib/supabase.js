let clientPromise

export async function getSupabase() {
  const { VITE_DATA_SOURCE, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = import.meta.env
  if (
    VITE_DATA_SOURCE !== 'supabase' ||
    !VITE_SUPABASE_URL ||
    !VITE_SUPABASE_ANON_KEY
  ) {
    return null
  }

  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY),
    )
  }
  return clientPromise
}
