import { useEffect, useState } from 'react'
import { categories as localCategories } from '../data/categories.js'
import { products as localProducts } from '../data/products.js'
import { getCategories, getProducts } from '../services/productService.js'

export function useProducts({ categorySlug, featuredOnly = false } = {}) {
  const [products, setProducts] = useState(() =>
    localProducts.filter((product) => product.is_active),
  )
  const [categories, setCategories] = useState(() =>
    localCategories.filter((category) => category.is_active),
  )

  useEffect(() => {
    let active = true
    Promise.all([getProducts({ categorySlug, featuredOnly }), getCategories()]).then(
      ([nextProducts, nextCategories]) => {
        if (!active) return
        setProducts(nextProducts)
        setCategories(nextCategories)
      },
    )
    return () => {
      active = false
    }
  }, [categorySlug, featuredOnly])

  return { products, categories }
}
