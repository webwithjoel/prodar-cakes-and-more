export function formatDateInput(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function minimumDateTime(noticeHours = 24) {
  const date = new Date()
  date.setHours(date.getHours() + noticeHours)
  while (date.getDay() === 0) date.setDate(date.getDate() + 1)
  return date
}

export function minimumDate(noticeHours = 24) {
  return formatDateInput(minimumDateTime(noticeHours))
}

export function validateOrderDate(value, noticeHours = 24) {
  if (!value) return 'Choose a needed-by date.'
  const selected = new Date(`${value}T00:00:00`)
  if (Number.isNaN(selected.getTime())) return 'Choose a valid date.'
  if (selected.getDay() === 0) return "We take orders Mon–Sat with 24 hours' notice."
  const minimum = minimumDateTime(noticeHours)
  minimum.setHours(0, 0, 0, 0)
  if (selected < minimum) return `Please allow at least ${noticeHours} hours' notice.`
  return ''
}
