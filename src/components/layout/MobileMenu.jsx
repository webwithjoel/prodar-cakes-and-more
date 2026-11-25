import { useEffect } from 'react'
import { ArrowUpRight, Camera, MessageCircle, X } from 'lucide-react'
import { business } from '../../data/business.js'
import { content } from '../../data/content.js'
import { whatsappUrl } from '../../utils/whatsapp.js'

export default function MobileMenu({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button
        className="absolute inset-0 size-full cursor-default bg-ink/50"
        type="button"
        aria-label={content.navigation.closeMenu}
        onClick={onClose}
      />
      <nav
        id="mobile-menu"
        className="absolute right-0 top-0 flex h-full w-[min(88vw,390px)] flex-col bg-cream p-6 shadow-2xl"
        aria-label={content.navigation.menuTitle}
        aria-modal="true"
        role="dialog"
      >
        <div className="mb-8 flex items-center justify-between">
          <img className="h-12 max-w-[180px] object-contain" src="/images/logo-plum.png" alt="Prodar's Cakes and More" />
          <button
            className="grid size-11 place-items-center rounded-full bg-pink-soft text-plum"
            type="button"
            aria-label={content.navigation.closeMenu}
            onClick={onClose}
          >
            <X aria-hidden="true" size={22} />
          </button>
        </div>
        <ul className="space-y-1">
          {content.navigation.links.map((link) => (
            <li key={link.href}>
              <a
                className="flex min-h-12 items-center justify-between border-b border-pink-soft px-1 font-medium text-ink transition hover:text-plum"
                href={link.href}
                onClick={onClose}
              >
                {link.label}
                <ArrowUpRight aria-hidden="true" size={17} className="text-plum" />
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-auto space-y-3">
          <a
            className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-plum px-5 font-semibold text-white transition hover:bg-plum-dark"
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
          >
            <MessageCircle aria-hidden="true" size={18} />
            {content.navigation.orderOnWhatsApp}
          </a>
          <a
            className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-pink px-5 font-semibold text-plum"
            href={business.instagram.url}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
          >
            <Camera aria-hidden="true" size={18} />
            {content.navigation.instagram}
          </a>
        </div>
      </nav>
    </div>
  )
}
