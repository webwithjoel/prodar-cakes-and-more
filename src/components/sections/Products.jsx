import { useEffect, useState } from 'react'
import { content } from '../../data/content.js'
import { useProducts } from '../../hooks/useProducts.js'
import ProductCard from '../product/ProductCard.jsx'

const filters = [
  { label: 'All Favourites', slug: null, featured: true },
  { label: 'Cakes', slug: 'cakes' },
  { label: 'Snacks & Small Chops', slug: 'snacks-small-chops' },
  { label: 'Parfait & Desserts', slug: 'parfait-desserts' },
  { label: 'Surprise & Decor', slug: 'surprise-decor' },
  { label: 'Training', slug: 'training' },
]

export default function Products() {
  const [active, setActive] = useState(filters[0])
  const { products } = useProducts({
    categorySlug: active.slug,
    featuredOnly: active.featured,
  })

  useEffect(() => {
    const handleCategory = (event) => {
      const next = filters.find((filter) => filter.slug === event.detail)
      if (next) setActive(next)
    }
    window.addEventListener('prodar-category', handleCategory)
    return () => window.removeEventListener('prodar-category', handleCategory)
  }, [])

  return (
    <section id="products" className="bg-pink-soft/35 px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-display text-3xl font-semibold text-plum sm:text-4xl">
          {content.headings.products}
        </h2>
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter.label}
              onClick={() => setActive(filter)}
              aria-pressed={active.label === filter.label}
              className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold ${
                active.label === filter.label
                  ? 'bg-plum text-white'
                  : 'border border-pink-soft bg-white text-plum'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
