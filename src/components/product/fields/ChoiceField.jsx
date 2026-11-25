export default function ChoiceField({ label, hint, options, value, onChange, required, imageKey }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-plum">{label}{required ? ' *' : ''}</legend>
      {hint && <p className="mt-1 text-xs leading-5 text-ink/60">{hint}</p>}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.label
          return (
            <label
              key={optionValue}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 text-sm ${
                value === optionValue ? 'border-plum bg-pink-soft text-plum' : 'border-pink-soft text-ink'
              }`}
            >
              <input
                type="radio"
                name={label}
                value={optionValue}
                checked={value === optionValue}
                onChange={() => onChange(optionValue)}
                className="accent-[#8F045F]"
              />
              <span>{optionValue}</span>
            </label>
          )
        })}
      </div>
      {value && imageKey && (() => {
        const selected = options.find((option) => typeof option === 'object' && option.label === value)
        return selected?.image ? (
          <img src={selected.image} alt="" className="mt-3 h-28 w-full rounded-xl object-cover" />
        ) : null
      })()}
    </fieldset>
  )
}
