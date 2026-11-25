export default function AddonField({ label, hint, addons, value, onChange, required }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-plum">{label}{required ? ' *' : ''}</legend>
      {hint && <p className="mt-1 text-xs leading-5 text-ink/60">{hint}</p>}
      <div className="mt-3 space-y-2">
        {addons.map((addon) => (
          <div key={addon.id} className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-pink-soft px-3">
            <div>
              <p className="text-sm text-ink">{addon.label}</p>
              <p className="text-xs text-plum">+₦{Number(addon.price).toLocaleString('en-NG')}</p>
            </div>
            <div className="flex shrink-0 items-center">
              <button
                type="button"
                className="grid size-11 place-items-center"
                aria-label={`Remove ${addon.label}`}
                onClick={() => onChange(addon.id, Math.max(0, Number(value[addon.id] ?? 0) - 1))}
              >−</button>
              <span className="w-8 text-center text-sm font-semibold">{value[addon.id] ?? 0}</span>
              <button
                type="button"
                className="grid size-11 place-items-center"
                aria-label={`Add ${addon.label}`}
                onClick={() => onChange(addon.id, Math.min(addon.max, Number(value[addon.id] ?? 0) + 1))}
              >+</button>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  )
}
