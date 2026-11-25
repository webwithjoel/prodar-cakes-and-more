import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, X } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { formatNaira } from '../../utils/format.js'
import { calcLineTotal, bulkPercent } from '../../utils/pricing.js'
import { minimumDate, validateOrderDate } from '../../utils/dates.js'
import ChoiceField from './fields/ChoiceField.jsx'
import AddonField from './fields/AddonField.jsx'
import TextField from './fields/TextField.jsx'

function initialSelections(product) {
  const config = product.customization ?? {}
  if (config.model === 'cake') {
    return {
      size: config.size?.default ?? config.defaults?.size ?? '8',
      layers: config.layers?.default ?? config.defaults?.layers ?? 1,
      flavour: config.defaults?.flavour ?? config.flavours?.[0]?.label,
      finish: config.defaults?.finish ?? config.finishes?.[0]?.label,
      addons: { ...(config.defaults?.addons ?? {}) },
      message: '',
      theme: '',
      date: '',
      time: '',
      photo: null,
      note: '',
    }
  }
  if (config.model === 'wedding') {
    return { tier: config.tiers?.[0]?.label, flavour: 'Vanilla', addons: {}, weddingDate: '', venue: '', colours: '', photo: null, note: '' }
  }
  if (config.model === 'unit') {
    return {
      variant: config.variants?.[0]?.label,
      flavour: config.flavours?.[0]?.label,
      themedCases: false,
      extraToppings: false,
      giftPack: false,
      eventLabelUnits: 0,
    }
  }
  if (config.model === 'tiered') {
    return {
      variant: config.variants?.[0]?.label,
      size: config.sizes?.[0]?.label,
      tier: config.tiers?.[0]?.label,
      class: config.classes?.[0]?.label,
      addons: {},
      pepperSauce: 0,
      recipientName: '',
      occasion: '',
      date: '',
      time: '',
      message: '',
      venue: '',
      colourTheme: '',
      startDate: '',
      note: '',
    }
  }
  return {}
}

export default function CustomizeModal({ product, onClose }) {
  const [selections, setSelections] = useState(() => initialSelections(product))
  const [quantity, setQuantity] = useState(1)
  const [review, setReview] = useState(false)
  const [dateError, setDateError] = useState('')
  const dialogRef = useRef(null)
  const { addItem } = useCart()
  const config = product.customization ?? {}

  useEffect(() => {
    const previous = document.activeElement
    dialogRef.current?.focus()
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href]')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      previous?.focus()
    }
  }, [onClose])

  const set = (key, value) => setSelections((current) => ({ ...current, [key]: value }))
  const setAddon = (key, amount) =>
    setSelections((current) => ({ ...current, addons: { ...(current.addons ?? {}), [key]: amount } }))

  const lineTotal = calcLineTotal(product, selections, quantity)
  const discount = bulkPercent(product, quantity)

  const validate = () => {
    const notice = config.model === 'wedding' ? 72 : 24
    const date = selections.date || selections.weddingDate || selections.startDate
    if ((config.model === 'cake' || config.model === 'wedding') && !date) {
      setDateError(`Choose a needed-by date with ${notice} hours' notice.`)
      return false
    }
    if (date) {
      const error = validateOrderDate(date, notice)
      if (error) {
        setDateError(error)
        return false
      }
    }
    setDateError('')
    return true
  }

  const addToCart = () => {
    if (!validate()) return
    if (review) {
      addItem({
        key: `${product.slug}-${JSON.stringify(selections)}-${quantity}`,
        product_slug: product.slug,
        product_name: product.name,
        name: product.name,
        qty: quantity,
        selections,
        line_unit: calcLineTotal(product, selections, 1),
        bulk_rules: product.bulk_rules ?? [],
        bulk_pct: discount,
        line_total: lineTotal,
        image: selections.photo ? selections.photo.dataUrl : product.image,
      })
      onClose()
    } else {
      setReview(true)
    }
  }

  const reviewLines = Object.entries(selections)
    .filter(([, value]) => value !== '' && value !== false && value !== null && !(typeof value === 'object' && !value.dataUrl))
    .map(([key, value]) => {
      if (key === 'addons') {
        return Object.entries(value).filter(([, count]) => count > 0).map(([id, count]) => `${id}: ${count}`).join(', ')
      }
      return `${key}: ${typeof value === 'object' ? value.name : value}`
    })

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 md:items-center md:p-6"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-label={`Customize ${product.name}`}
        className="flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-cream shadow-2xl md:max-w-2xl md:rounded-3xl"
      >
        <header className="flex min-h-16 items-center justify-between border-b border-pink-soft px-5">
          {review ? (
            <button type="button" onClick={() => setReview(false)} className="flex min-h-11 items-center gap-2 font-semibold text-plum">
              <ChevronLeft size={18} /> Back
            </button>
          ) : (
            <h2 className="font-display text-xl font-semibold text-plum">Customize {product.name}</h2>
          )}
          <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full bg-pink-soft text-plum" aria-label="Close customization">
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-5">
          {review ? (
            <div>
              <h3 className="font-display text-2xl font-semibold text-plum">Estimated Total</h3>
              <p className="mt-2 text-sm text-ink/70">Quantity: {quantity}</p>
              <dl className="mt-5 space-y-3 rounded-2xl bg-pink-soft/40 p-4">
                {reviewLines.map((line) => (
                  <div key={line} className="text-sm text-ink">
                    {line}
                  </div>
                ))}
              </dl>
              {discount > 0 && <p className="mt-4 text-sm font-semibold text-plum">{discount}% bulk discount applied</p>}
            </div>
          ) : (
            <div className="space-y-6">
              {config.model === 'cake' && (
                <>
                  <ChoiceField label="Size" hint="Choose your cake size." options={config.size.options} value={selections.size} onChange={(value) => set('size', value)} required />
                  <ChoiceField label="Layers" hint="Choose the number of layers." options={config.layers.options} value={selections.layers} onChange={(value) => set('layers', Number(value))} required />
                  <ChoiceField label="Flavour" hint="Your selected flavour adjusts the price." options={config.flavours} value={selections.flavour} onChange={(value) => set('flavour', value)} required />
                  <ChoiceField label="Finish" hint="Buttercream or fondant." options={config.finishes} value={selections.finish} onChange={(value) => set('finish', value)} required />
                  <AddonField label="Add-ons" hint="Choose optional extras." addons={config.addons} value={selections.addons} onChange={setAddon} />
                  <TextField label="Message/name on cake" hint="e.g. Happy Birthday Daddy" value={selections.message} maxLength={40} onChange={(value) => set('message', value)} />
                  <TextField label="Colour/theme" hint="e.g. blue and gold, CoComelon" value={selections.theme} onChange={(value) => set('theme', value)} />
                  <TextField label="Needed-by date" hint="Mon–Sat, at least 24 hours' notice." type="date" min={minimumDate(24)} value={selections.date} onChange={(value) => { set('date', value); setDateError(validateOrderDate(value, 24)) }} required />
                  <TextField label="Needed-by time" hint="Choose the time you need the order." type="time" value={selections.time} onChange={(value) => set('time', value)} />
                  <label className="block">
                    <span className="text-sm font-semibold text-plum">Inspiration photo</span>
                    <span className="mt-1 block text-xs leading-5 text-ink/60">A small thumbnail for this order only.</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (!file) return
                        if (file.size > 1024 * 1024) {
                          set('photo', { name: file.name, error: 'Please choose an image smaller than 1 MB.' })
                          return
                        }
                        const reader = new FileReader()
                        reader.onload = () => set('photo', { name: file.name, dataUrl: reader.result })
                        reader.readAsDataURL(file)
                      }}
                      className="mt-3 min-h-12 w-full rounded-xl border border-pink-soft px-3 py-2 text-sm"
                    />
                    {selections.photo?.error && <span className="mt-2 block text-xs text-red-700">{selections.photo.error}</span>}
                    {selections.photo?.dataUrl && <img src={selections.photo.dataUrl} alt="Inspiration preview" className="mt-3 h-28 w-28 rounded-xl object-cover" />}
                  </label>
                  <TextField label="Note" hint="Add any extra instructions." value={selections.note} onChange={(value) => set('note', value)} />
                </>
              )}

              {config.model === 'wedding' && (
                <>
                  <ChoiceField label="Tier" hint="Choose a wedding cake tier set." options={config.tiers} value={selections.tier} onChange={(value) => set('tier', value)} required />
                  <ChoiceField label="Flavour" hint="Flavour surcharge applies per tier." options={config.flavoursPerTier} value={selections.flavour} onChange={(value) => set('flavour', value)} required />
                  <AddonField label="Add-ons" hint="Choose optional wedding extras." addons={config.addons} value={selections.addons} onChange={setAddon} />
                  <TextField label="Wedding date" hint="Mon–Sat, at least 72 hours' notice." type="date" min={minimumDate(72)} value={selections.weddingDate} onChange={(value) => { set('weddingDate', value); setDateError(validateOrderDate(value, 72)) }} required />
                  <TextField label="Venue" hint="Enter the venue or location." value={selections.venue} onChange={(value) => set('venue', value)} required />
                  <TextField label="Colours" hint="Tell us the preferred colour scheme." value={selections.colours} onChange={(value) => set('colours', value)} />
                  <label className="block">
                    <span className="text-sm font-semibold text-plum">Inspiration photo</span>
                    <span className="mt-1 block text-xs leading-5 text-ink/60">A small thumbnail for this order only.</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (!file) return
                        if (file.size > 1024 * 1024) {
                          set('photo', { name: file.name, error: 'Please choose an image smaller than 1 MB.' })
                          return
                        }
                        const reader = new FileReader()
                        reader.onload = () => set('photo', { name: file.name, dataUrl: reader.result })
                        reader.readAsDataURL(file)
                      }}
                      className="mt-3 min-h-12 w-full rounded-xl border border-pink-soft px-3 py-2 text-sm"
                    />
                    {selections.photo?.error && <span className="mt-2 block text-xs text-red-700">{selections.photo.error}</span>}
                    {selections.photo?.dataUrl && <img src={selections.photo.dataUrl} alt="Inspiration preview" className="mt-3 h-28 w-28 rounded-xl object-cover" />}
                  </label>
                  <TextField label="Note" hint="Add any extra wedding cake instructions." value={selections.note} onChange={(value) => set('note', value)} />
                </>
              )}

              {config.model === 'unit' && (
                <>
                  {config.variants && <ChoiceField label="Size" hint="Choose a size." options={config.variants} value={selections.variant} onChange={(value) => set('variant', value)} required />}
                  {config.flavours && <ChoiceField label="Flavour" hint="Choose a flavour." options={config.flavours} value={selections.flavour} onChange={(value) => set('flavour', value)} required />}
                  {config.unitPrice && <ChoiceField label="Quantity" hint="Choose a preset quantity or enter one below." options={(config.quantityPresets ?? []).map(String)} value={String(quantity)} onChange={(value) => setQuantity(Number(value))} required />}
                  {config.toppings && <ChoiceField label="Extra toppings" hint="Select whether to add extra toppings." options={['No extra toppings', 'Extra toppings']} value={selections.extraToppings ? 'Extra toppings' : 'No extra toppings'} onChange={(value) => set('extraToppings', value === 'Extra toppings')} />}
                  {config.toppings && <ChoiceField label="Layer flavour" hint="Choose a classic or strawberry layer." options={config.layers} value={selections.layer} onChange={(value) => set('layer', value)} />}
                  {config.unitPrice === undefined && config.giftPack && (
                    <ChoiceField label="Gift pack" hint="Add a ribbon and label for +₦1,000 per unit." options={['No gift pack', 'Add gift pack']} value={selections.giftPack ? 'Add gift pack' : 'No gift pack'} onChange={(value) => set('giftPack', value === 'Add gift pack')} />
                  )}
                  {config.unitPrice === undefined && config.eventLabel !== undefined && (
                    <ChoiceField label="Custom event label" hint="Add a label per unit for souvenirs." options={['No event label', 'Add event label']} value={selections.eventLabelUnits ? 'Add event label' : 'No event label'} onChange={(value) => set('eventLabelUnits', value === 'Add event label' ? quantity : 0)} />
                  )}
                  {config.themedCases !== undefined && (
                    <ChoiceField label="Sprinkles/themed cases" hint="Add themed cases for +₦50 per cupcake." options={['Standard cases', 'Sprinkles/themed cases']} value={selections.themedCases ? 'Sprinkles/themed cases' : 'Standard cases'} onChange={(value) => set('themedCases', value === 'Sprinkles/themed cases')} />
                  )}
                  {config.toppings && Array.isArray(config.toppings) && (
                    <ChoiceField label="Topping" hint="Choose one topping." options={config.toppings} value={selections.topping} onChange={(value) => set('topping', value)} required />
                  )}
                </>
              )}

              {config.model === 'tiered' && (
                <>
                  {config.variants && <ChoiceField label="Size" hint="Choose a size." options={config.variants} value={selections.variant} onChange={(value) => set('variant', value)} required />}
                  {config.sizes && <ChoiceField label="Tray size" hint="Choose a serving size." options={config.sizes} value={selections.size} onChange={(value) => set('size', value)} required />}
                  {config.tiers && <ChoiceField label="Package" hint="Choose a package." options={config.tiers} value={selections.tier} onChange={(value) => set('tier', value)} required />}
                  {config.classes && <ChoiceField label="Training class" hint="Choose a class." options={config.classes} value={selections.class} onChange={(value) => set('class', value)} required />}
                  {config.addons && <AddonField label="Add-ons" hint="Choose optional extras." addons={config.addons} value={selections.addons} onChange={setAddon} />}
                  {config.choices && <ChoiceField label="Tray items" hint="Choose items up to the tray's limit." options={config.choices} value={selections.item} onChange={(value) => set('item', value)} />}
                  {config.pepperSauce && <TextField label="Pepper sauce dip pots" hint="Maximum 4 pots." type="number" value={selections.pepperSauce} onChange={(value) => set('pepperSauce', Math.min(4, Math.max(0, Number(value) || 0)))} />}
                  {product.slug === 'surprise-packages' && (
                    <>
                      <TextField label="Recipient name" hint="Who is the surprise for?" value={selections.recipientName} onChange={(value) => set('recipientName', value)} required />
                      <TextField label="Occasion" hint="Enter the occasion." value={selections.occasion} onChange={(value) => set('occasion', value)} required />
                      <TextField label="Date" hint="Mon–Sat, at least 24 hours' notice." type="date" min={minimumDate(24)} value={selections.date} onChange={(value) => { set('date', value); setDateError(validateOrderDate(value, 24)) }} required />
                      <TextField label="Time" hint="Choose the time you need the package." type="time" value={selections.time} onChange={(value) => set('time', value)} required />
                      <TextField label="Message" hint="A short message for the recipient." value={selections.message} onChange={(value) => set('message', value)} />
                      <TextField label="Note" hint="Add any extra package instructions." value={selections.note} onChange={(value) => set('note', value)} />
                    </>
                  )}
                  {product.slug === 'balloon-decoration' && (
                    <>
                      <TextField label="Occasion" hint="Enter the occasion." value={selections.occasion} onChange={(value) => set('occasion', value)} required />
                      <TextField label="Venue" hint="Enter the venue or location." value={selections.venue} onChange={(value) => set('venue', value)} required />
                      <TextField label="Colour theme" hint="Tell us the preferred balloon colours." value={selections.colourTheme} onChange={(value) => set('colourTheme', value)} />
                      <TextField label="Date" hint="Mon–Sat, at least 24 hours' notice." type="date" min={minimumDate(24)} value={selections.date} onChange={(value) => { set('date', value); setDateError(validateOrderDate(value, 24)) }} required />
                      <TextField label="Note" hint="Add any extra decoration instructions." value={selections.note} onChange={(value) => set('note', value)} />
                    </>
                  )}
                  {product.slug === 'baking-pastry-training' && (
                    <>
                      <TextField label="Preferred start date" hint="Mon–Sat, at least 24 hours' notice." type="date" min={minimumDate(24)} value={selections.startDate} onChange={(value) => { set('startDate', value); setDateError(validateOrderDate(value, 24)) }} required />
                      <TextField label="Note" hint="Tell us any experience or preference." value={selections.note} onChange={(value) => set('note', value)} />
                    </>
                  )}
                </>
              )}

              {dateError && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{dateError}</p>}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-pink-soft bg-white px-5 py-3">
          {discount > 0 && <p className="mb-1 text-xs font-semibold text-plum">{discount}% bulk discount applied</p>}
          <div className="flex items-center justify-between gap-3">
            <div className="shrink-0">
              <p className="text-xs text-ink/60">Estimated Total</p>
              <p className="font-display text-lg font-semibold text-plum">{formatNaira(lineTotal)}</p>
            </div>
            <div className="flex items-center rounded-full border border-pink-soft">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid size-11 place-items-center" aria-label="Decrease quantity">−</button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                className="w-11 border-0 text-center text-sm"
                aria-label="Quantity"
              />
              <button type="button" onClick={() => setQuantity((value) => value + 1)} className="grid size-11 place-items-center" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" onClick={addToCart} className="min-h-12 rounded-full bg-plum px-5 text-sm font-semibold text-white">
              {review ? 'Add to Cart' : 'Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
