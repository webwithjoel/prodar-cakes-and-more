/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('prodars-cart', [])

  const addItem = useCallback((item) => {
    setItems((currentItems) => {
      const existing = currentItems.find((entry) => entry.key === item.key)
      if (!existing) return [...currentItems, item]
      return currentItems.map((entry) =>
        entry.key === item.key ? { ...entry, qty: entry.qty + item.qty } : entry,
      )
    })
  }, [setItems])

  const updateQuantity = useCallback((key, qty) => {
    setItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.key !== key) return item
          const nextQty = Math.max(1, Number(qty) || 1)
          if (item.line_unit) {
            const matching = (item.bulk_rules ?? [])
              .filter((rule) => nextQty >= Number(rule.min))
              .sort((a, b) => Number(b.min) - Number(a.min))
            const pct = Number(matching[0]?.pct ?? 0)
            return {
              ...item,
              qty: nextQty,
              bulk_pct: pct,
              line_total: Math.round(item.line_unit * nextQty * (1 - pct / 100)),
            }
          }
          return { ...item, qty: nextQty, line_total: Number(item.line_total || 0) }
        })
        .filter((item) => item.qty > 0),
    )
  }, [setItems])

  const removeItem = useCallback(
    (key) => setItems((currentItems) => currentItems.filter((item) => item.key !== key)),
    [setItems],
  )
  const clearCart = useCallback(() => setItems([]), [setItems])
  const count = items.reduce((total, item) => total + (Number(item.qty) || 0), 0)

  const value = useMemo(
    () => ({ items, count, addItem, updateQuantity, removeItem, clearCart }),
    [items, count, addItem, updateQuantity, removeItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
