export function imageUrl(value) {
  if (!value) return null
  if (value.startsWith('/') || value.startsWith('http')) return value

  const baseUrl = import.meta.env.VITE_SUPABASE_URL
  if (!baseUrl) return null
  return `${baseUrl}/storage/v1/object/public/product-images/${value}`
}
