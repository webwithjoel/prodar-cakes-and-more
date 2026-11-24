import { MessageCircle } from 'lucide-react'
import { content } from '../../data/content.js'
import { whatsappUrl } from '../../utils/whatsapp.js'

export default function WhatsAppFab() {
  return (
    <a
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#1FA855] text-white shadow-xl transition hover:scale-105 focus-visible:outline-white sm:bottom-7 sm:right-7"
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label={content.whatsappCta}
    >
      <MessageCircle aria-hidden="true" size={25} />
    </a>
  )
}
