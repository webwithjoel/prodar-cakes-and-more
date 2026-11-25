import { useState } from 'react'
import { minimumDate, validateOrderDate } from '../../utils/dates.js'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'

export default function CheckoutForm({ noticeHours, onSubmit }) {
  const [stored, setStored] = useLocalStorage('prodars-checkout', {
    name: '',
    phone: '',
    fulfilment: 'Pickup',
    address: '',
    date: '',
    time: '',
    note: '',
  })
  const [errors, setErrors] = useState({})
  const data = stored

  const set = (key, value) => setStored((current) => ({ ...current, [key]: value }))

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!data.name.trim()) nextErrors.name = 'Enter your name.'
    if (!data.phone.trim()) nextErrors.phone = 'Enter your phone number.'
    if (data.fulfilment === 'Delivery' && !data.address.trim()) nextErrors.address = 'Enter your delivery address.'
    if (!data.date) nextErrors.date = 'Choose a needed-by date.'
    else {
      const dateError = validateOrderDate(data.date, noticeHours)
      if (dateError) nextErrors.date = dateError
    }
    if (!data.time) nextErrors.time = 'Choose a needed-by time.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSubmit(data)
  }

  const fieldClass = 'mt-2 min-h-12 w-full rounded-xl border border-pink-soft px-3 text-sm text-ink'

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-semibold text-plum">
        Name *
        <input className={fieldClass} value={data.name} onChange={(event) => set('name', event.target.value)} />
        {errors.name && <span className="mt-1 block text-xs text-red-700">{errors.name}</span>}
      </label>
      <label className="block text-sm font-semibold text-plum">
        Phone *
        <input className={fieldClass} type="tel" value={data.phone} onChange={(event) => set('phone', event.target.value)} />
        {errors.phone && <span className="mt-1 block text-xs text-red-700">{errors.phone}</span>}
      </label>
      <fieldset>
        <legend className="text-sm font-semibold text-plum">Fulfilment *</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {['Pickup', 'Delivery'].map((option) => (
            <label
              key={option}
              className={`flex min-h-12 cursor-pointer items-center justify-center rounded-xl border text-sm ${
                data.fulfilment === option ? 'border-plum bg-pink-soft font-semibold text-plum' : 'border-pink-soft'
              }`}
            >
              <input className="sr-only" type="radio" name="fulfilment" checked={data.fulfilment === option} onChange={() => set('fulfilment', option)} />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
      {data.fulfilment === 'Delivery' && (
        <label className="block text-sm font-semibold text-plum">
          Address *
          <textarea className={`${fieldClass} min-h-24 py-3`} value={data.address} onChange={(event) => set('address', event.target.value)} />
          {errors.address && <span className="mt-1 block text-xs text-red-700">{errors.address}</span>}
        </label>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-plum">
          Date needed *
          <input
            className={fieldClass}
            type="date"
            min={minimumDate(noticeHours)}
            value={data.date}
            onChange={(event) => set('date', event.target.value)}
          />
          {errors.date && <span className="mt-1 block text-xs text-red-700">{errors.date}</span>}
        </label>
        <label className="block text-sm font-semibold text-plum">
          Time needed *
          <input className={fieldClass} type="time" value={data.time} onChange={(event) => set('time', event.target.value)} />
          {errors.time && <span className="mt-1 block text-xs text-red-700">{errors.time}</span>}
        </label>
      </div>
      <label className="block text-sm font-semibold text-plum">
        Note
        <textarea className={`${fieldClass} min-h-24 py-3`} value={data.note} onChange={(event) => set('note', event.target.value)} />
      </label>
      <button type="submit" className="min-h-12 w-full rounded-full bg-plum px-5 font-semibold text-white">
        Send Order on WhatsApp
      </button>
      <p className="text-center text-xs text-ink/60">
        Delivery fee, if any, is confirmed with you on WhatsApp.
      </p>
    </form>
  )
}
