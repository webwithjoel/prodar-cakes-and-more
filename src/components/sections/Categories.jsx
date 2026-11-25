import { ArrowRight, Gift, GraduationCap } from 'lucide-react'
import { content } from '../../data/content.js'
import { useProducts } from '../../hooks/useProducts.js'

export default function Categories() {
  const { categories } = useProducts()

  const selectCategory = (slug) => {
    window.dispatchEvent(new CustomEvent('prodar-category', { detail: slug }))
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="categories" className="bg-cream px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-display text-3xl font-semibold text-plum sm:text-4xl">
          {content.headings.categories}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const FallbackIcon = category.slug === 'training' ? GraduationCap : Gift
            return (
              <button
                type="button"
                onClick={() => selectCategory(category.slug)}
                className="group relative min-h-52 overflow-hidden rounded-2xl text-left shadow-lg"
                key={category.id}
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt=""
                    className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-magenta-deep to-magenta">
                    <FallbackIcon className="absolute bottom-5 right-5 size-20 text-pink/35" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/95 via-plum-dark/55 to-transparent" />
                <div className="absolute bottom-0 p-5 text-white">
                  <p className="font-display text-xl font-semibold">{category.name}</p>
                  <p className="mt-1 max-w-sm text-xs leading-5 text-white/85">{category.blurb}</p>
                  <span className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-pink px-4 text-sm font-semibold text-plum">
                    Explore <ArrowRight aria-hidden="true" size={16} />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
