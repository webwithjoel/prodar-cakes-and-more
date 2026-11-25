import { useState } from 'react'
import { Gift } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { formatNaira } from '../../utils/format.js'
import { imageUrl } from '../../utils/image.js'
import { calcLineTotal } from '../../utils/pricing.js'
import { bulkPercent } from '../../utils/pricing.js'
import CustomizeModal from './CustomizeModal.jsx'

function getDefaultSelections(product) {
  const config = product.customization ?? {}
  if (config.model === 'cake') {
    return {
      size: config.size?.default ?? '8',
      layers: config.layers?.default ?? 1,
      flavour: config.defaults?.flavour,
      finish: config.defaults?.finish,
      addons: config.defaults?.addons ?? {},
    }
  }
  if (config.model === 'wedding') {
    return { tier: config.tiers?.[0]?.label, flavour: 'Vanilla', addons: {} }
  }
  if (config.model === 'unit') {
    const selections = {
      variant: config.variants?.[0]?.label,
      flavour: config.flavours?.[0]?.label,
    }
    if (config.toppings) selections.extraToppings = false
    return selections
  }
  if (config.model === 'tiered') {
    return {
      variant: config.variants?.[0]?.label,
      size: config.sizes?.[0]?.label,
      tier: config.tiers?.[0]?.label,
      class: config.classes?.[0]?.label,
      addons: {},
    }
  }
  return {}
}

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [customizing, setCustomizing] = useState(false)
  const { addItem } = useCart()
  const image = imageUrl(product.image)

  const updateQuantity = (value) => setQuantity(Math.max(1, Number(value) || 1))

  const addToCart = () => {
    const selections = getDefaultSelections(product)
    const lineUnit = calcLineTotal(product, selections, 1)
    addItem({
      key: `${product.slug}-default`,
      product_slug: product.slug,
      name: product.name,
      qty: quantity,
      selections,
      line_unit: lineUnit,
      bulk_rules: product.bulk_rules ?? [],
      bulk_pct: bulkPercent(product, quantity),
      line_total: calcLineTotal(product, selections, quantity),
      image,
    })
  }

  return (
    <article className="flex overflow-hidden rounded-2xl border border-pink-soft bg-white shadow-sm">
      <div className="flex w-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-magenta-deep to-magenta">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="size-full object-cover"
            />
          ) : (
            <Gift className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-pink/70" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-display text-lg font-semibold text-plum">{product.name}</h3>
          <p className="mt-1 min-h-10 text-xs leading-5 text-ink/70">{product.short_description}</p>
          <p className="mt-3 text-sm font-semibold text-plum">From {formatNaira(product.base_price)}</p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex items-center rounded-full border border-pink-soft">
              <button
                type="button"
                className="grid size-11 place-items-center text-plum"
                aria-label={`Decrease ${product.name} quantity`}
                onClick={() => updateQuantity(quantity - 1)}
              >
                −
              </button>
              <input
                className="h-11 w-10 border-0 bg-transparent text-center text-sm font-semibold text-ink"
                type="number"
                min="1"
                value={quantity}
                aria-label={`${product.name} quantity`}
                onChange={(event) => updateQuantity(event.target.value)}
              />
              <button
                type="button"
                className="grid size-11 place-items-center text-plum"
                aria-label={`Increase ${product.name} quantity`}
                onClick={() => updateQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={addToCart}
              className="min-h-11 rounded-full bg-plum px-4 text-xs font-semibold text-white transition hover:bg-plum-dark"
            >
              Add to Cart
            </button>
          </div>
          <button
            type="button"
            onClick={() => setCustomizing(true)}
            className="mt-3 min-h-11 rounded-full border border-pink-soft px-4 text-sm font-semibold text-plum"
          >
            Customize
          </button>
        </div>
      </div>
      {customizing && (
        <CustomizeModal product={product} onClose={() => setCustomizing(false)} />
      )}
    </article>
  )
}
