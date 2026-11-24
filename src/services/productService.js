import { business } from '../data/business.js'
import { categories as localCategories } from '../data/categories.js'
import { products as localProducts } from '../data/products.js'
import { getSupabase } from '../lib/supabase.js'

export async function getCategories() {
  try {
    const supabase = await getSupabase()
    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      if (error) throw error
      return data
    }
  } catch (error) {
    console.warn('Using local categories because the remote request failed.', error)
  }
  return localCategories.filter((category) => category.is_active).toSorted((a, b) => a.sort_order - b.sort_order)
}

export async function getProducts({ categorySlug, featuredOnly = false } = {}) {
  try {
    const supabase = await getSupabase()
    if (supabase) {
      let query = supabase.from('products').select('*').eq('is_active', true)
      if (categorySlug) query = query.eq('category_slug', categorySlug)
      if (featuredOnly) query = query.eq('is_featured', true)
      const { data, error } = await query.order('sort_order')
      if (error) throw error
      return data
    }
  } catch (error) {
    console.warn('Using local products because the remote request failed.', error)
  }
  return localProducts
    .filter((item) => item.is_active)
    .filter((item) => !categorySlug || item.category_slug === categorySlug)
    .filter((item) => !featuredOnly || item.is_featured)
    .toSorted((a, b) => a.sort_order - b.sort_order)
}

export async function getProductBySlug(slug) {
  const product = (await getProducts()).find((item) => item.slug === slug)
  return product ?? null
}

export async function getSiteSettings() {
  try {
    const supabase = await getSupabase()
    if (supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'business')
        .maybeSingle()
      if (error) throw error
      return data?.value ?? business
    }
  } catch (error) {
    console.warn('Using local business details because the remote request failed.', error)
  }
  return business
}
