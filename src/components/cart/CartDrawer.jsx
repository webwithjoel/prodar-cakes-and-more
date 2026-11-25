import { useEffect, useRef, useState } from 'react'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { formatNaira } from '../../utils/format.js'
import { whatsappUrl } from '../../utils/whatsapp.js'
import { saveOrder } from '../../services/orderService.js'
import CheckoutForm from './CheckoutForm.jsx'
import ThankYou from './ThankYou.jsx'

function optionSummary(selections = {}) {
  const lines = []
  Object.entries(selections).forEach(([key, value]) => {
    if (key === 'addons' && value && typeof value === 'object') {
      Object.entries(value).forEach(([addon, count]) => {
        if (Number(count) > 0) lines.push(`${addon}: ${count}`)
      })
      return
    }
    if (value === '' || value === false || value === null || typeof value === 'undefined') return
    if (typeof value === 'object' && !value.name) return
    lines.push(`${key}: ${typeof value === 'object' ? value.name : value}`)
  })
  return lines
}

export default function CartDrawer({ open, onClose }) {
  const { items, count, updateQuantity, removeItem, clearCart } = useCart()
  const [checkout, setCheckout] = useState(false)
  const [thankYou, setThankYou] = useState(false)
  const drawerRef = useRef(null)
  const subtotal = items.reduce((total, item) => total + Number(item.line_total || 0), 0)
  const noticeHours = items.some((item) => item.product_slug === 'wedding-cake') ? 72 : 24

  useEffect(() => {
    if (!open) return undefined
    drawerRef.current?.focus()
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const submitOrder = async (data) => {
    const orderLines = items.map((item, index) => {
      const lines = optionSummary(item.selections)
      return `${index + 1}. ${item.name} x${item.qty} — ${formatNaira(item.line_total)}${lines.length ? `\n${lines.map((line) => `   • ${line}`).join('\n')}` : ''}`
    })
    const fulfilment = data.fulfilment === 'Delivery' ? `Delivery to address` : 'Pickup'
    const addressLine = data.fulfilment === 'Delivery' ? `\n*Address:* ${data.address}` : ''
    const message = `Hello Prodar's Cakes and More! 🎂 I'd like to place an order.\n\n*Name:* ${data.name}\n*Phone:* ${data.phone}\n*Needed on:* ${data.date} at ${data.time}\n*Fulfilment:* ${fulfilment}${addressLine}\n\n*ORDER*\n${orderLines.join('\n')}\n\n*Estimated total:* ${formatNaira(subtotal)}\n(Delivery fee, if any, to be confirmed.)\n*Note:* ${data.note || 'None'}\n\nI'll send my inspiration photo here if I have one. Thank you!`

    const order = {
      customer_name: data.name,
      phone: data.phone,
      fulfilment: data.fulfilment,
      address: data.fulfilment === 'Delivery' ? data.address : null,
      needed_at: `${data.date}T${data.time}`,
      note: data.note,
      estimated_total: subtotal,
      status: 'new',
      items: items.map((item) => ({
        product_slug: item.product_slug,
        product_name: item.name,
        qty: item.qty,
        selections: item.selections,
        line_total: item.line_total,
      })),
    }
    await saveOrder(order)
    clearCart()
    try {
      window.localStorage.removeItem('prodars-checkout')
    } catch {
      // Storage removal is optional.
    }
    setThankYou(true)
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-ink/55" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside
        ref={drawerRef}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
      >
        <header className="flex min-h-16 items-center justify-between border-b border-pink-soft px-5">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-plum">
            <ShoppingBag aria-hidden="true" size={20} />
            {thankYou ? 'Order ready' : checkout ? 'Checkout' : `Your Cart (${count})`}
          </h2>
          <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full bg-pink-soft text-plum" aria-label="Close cart">
            <X aria-hidden="true" size={20} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">
          {thankYou ? (
            <ThankYou onClose={onClose} />
          ) : checkout ? (
            <CheckoutForm noticeHours={noticeHours} onSubmit={submitOrder} />
          ) : items.length === 0 ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <ShoppingBag className="text-pink" aria-hidden="true" size={48} />
              <p className="mt-4 font-semibold text-plum">Your cart is empty</p>
              <button type="button" onClick={onClose} className="mt-5 min-h-11 rounded-full border border-pink px-5 font-semibold text-plum">Continue shopping</button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <article key={item.key} className="rounded-2xl border border-pink-soft bg-white p-3">
                  <div className="flex gap-3">
                    {item.image && <img src={item.image} alt="" className="size-20 rounded-xl object-cover" />}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display font-semibold text-plum">{item.name}</h3>
                      <div className="mt-1 space-y-0.5">
                        {optionSummary(item.selections).map((line) => <p key={line} className="text-xs text-ink/65">• {line}</p>)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-pink-soft">
                      <button type="button" className="grid size-11 place-items-center" aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.key, item.qty - 1)}>
                        <Minus aria-hidden="true" size={15} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                      <button type="button" className="grid size-11 place-items-center" aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.key, item.qty + 1)}>
                        <Plus aria-hidden="true" size={15} />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-plum">{formatNaira(item.line_total)}</p>
                    <button type="button" className="grid size-11 place-items-center text-badge-red" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.key)}>
                      <Trash2 aria-hidden="true" size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        {!thankYou && !checkout && items.length > 0 && (
          <footer className="border-t border-pink-soft bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-ink/60">Subtotal</p>
                <p className="font-display text-xl font-semibold text-plum">Estimated Total: {formatNaira(subtotal)}</p>
              </div>
            </div>
            <p className="mt-1 text-xs text-ink/60">Bulk discounts included</p>
            <button type="button" onClick={() => setCheckout(true)} className="mt-4 min-h-12 w-full rounded-full bg-plum px-5 font-semibold text-white">
              Checkout
            </button>
            <p className="mt-3 text-center text-xs text-ink/60">Delivery or pickup. Any delivery fee is confirmed with you on WhatsApp.</p>
          </footer>
        )}
      </aside>
    </div>
  )
}
