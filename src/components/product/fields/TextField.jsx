export default function TextField({ label, hint, value, onChange, type = 'text', maxLength, required, min }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-plum">{label}{required ? ' *' : ''}</span>
      {hint && <span className="mt-1 block text-xs leading-5 text-ink/60">{hint}</span>}
      <input
        type={type}
        value={value ?? ''}
        maxLength={maxLength}
        min={min}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 min-h-12 w-full rounded-xl border border-pink-soft px-3 text-sm text-ink"
      />
    </label>
  )
}
