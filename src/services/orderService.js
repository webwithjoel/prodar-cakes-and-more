import { getSupabase } from '../lib/supabase.js'

export async function saveOrder(order) {
  try {
    const supabase = await getSupabase()
    if (!supabase) return order

    const { items = [], ...orderDetails } = order
    const { data, error } = await supabase
      .from('orders')
      .insert(orderDetails)
      .select('id')
      .single()
    if (error) throw error

    if (items.length) {
      const { error: itemsError } = await supabase.from('order_items').insert(
        items.map((item) => ({
          order_id: data.id,
          product_slug: item.product_slug,
          product_name: item.product_name,
          qty: item.qty,
          selections: item.selections,
          line_total: item.line_total,
        })),
      )
      if (itemsError) throw itemsError
    }
    return { ...order, id: data.id }
  } catch (error) {
    console.warn('Order could not be saved remotely; continuing with the local order.', error)
    return order
  }
}
