import { business } from '../data/business.js'

export function whatsappUrl(message = '') {
  const baseUrl = `https://wa.me/${business.whatsappNumber}`
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl
}
