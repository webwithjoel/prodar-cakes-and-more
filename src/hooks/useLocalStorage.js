import { useCallback, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored === null ? initialValue : JSON.parse(stored)
    } catch {
      return initialValue
    }
  })

  const updateValue = useCallback(
    (nextValue) => {
      setValue((previousValue) => {
        const resolvedValue =
          typeof nextValue === 'function' ? nextValue(previousValue) : nextValue
        try {
          window.localStorage.setItem(key, JSON.stringify(resolvedValue))
        } catch {
          // Keep the in-memory state usable when browser storage is unavailable.
        }
        return resolvedValue
      })
    },
    [key],
  )

  return [value, updateValue]
}
