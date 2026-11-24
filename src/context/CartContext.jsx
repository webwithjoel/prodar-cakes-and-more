import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('prodars-cart', [])

  const addItem = (item) => {
    setItems((currentItems) => {
      const existing = currentItems.find((entry) => entry.key === item.key)
      if (!existing) return [...currentItems, item]
      return currentItems.map((entry) =>
        entry.key === item.key ? { ...entry, qty: entry.qty + item.qty } : entry,
      )
    })
  }

  const updateQuantity = (key, qty) => {
    setItems((currentItems) =>
      currentItems
        .map((item) => (item.key === key ? { ...item, qty: Math.max(1, qty) } : item))
        .filter((item) => item.qty > 0),
    )
  }

  const removeItem = (key) => setItems((currentItems) => currentItems.filter((item) => item.key !== key))
  const clearCart = () => setItems([])
  const count = items.reduce((total, item) => total + (Number(item.qty) || 0), 0)

  const value = useMemo(
    () => ({ items, count, addItem, updateQuantity, removeItem, clearCart }),
    [items, count],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
