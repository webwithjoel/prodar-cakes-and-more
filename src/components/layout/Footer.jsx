import { Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { business } from '../../data/business.js'
import { content } from '../../data/content.js'
import { whatsappUrl } from '../../utils/whatsapp.js'

export default function Footer() {
  return (
    <footer id="contact" className="bg-plum-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-14 lg:py-16">
        <div>
          <img className="mb-5 h-14 w-auto max-w-[200px] object-contain" src="/images/logo-white.png" alt={content.footer.logoAlt} />
          <p className="max-w-sm text-sm leading-7 text-white/85">{business.tagline}</p>
          <p className="mt-4 text-sm leading-6 text-white/75">{content.footerLine}</p>
        </div>

        <div>
          <h2 className="mb-4 font-display text-xl">{content.footer.contactHeading}</h2>
          <p className="mb-3 flex gap-3 text-sm leading-6 text-white/85">
            <MapPin className="mt-0.5 shrink-0 text-pink" aria-hidden="true" size={18} />
            {business.address}
          </p>
          <div className="space-y-2">
            {business.phones.map((phone) => (
              <a className="flex min-h-10 items-center gap-3 text-sm text-white/90 hover:text-pink" href={phone.href} key={phone.display}>
                <Phone className="text-pink" aria-hidden="true" size={17} />
                {phone.display}
              </a>
            ))}
            <a className="flex min-h-10 items-center gap-3 text-sm text-white/90 hover:text-pink" href={whatsappUrl()} target="_blank" rel="noreferrer">
              <MessageCircle className="text-pink" aria-hidden="true" size={17} />
              {content.navigation.orderOnWhatsApp}
            </a>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-xl">{content.footer.hoursHeading}</h2>
          <p className="text-sm text-white/90">{business.hours}</p>
          <p className="mt-1 text-sm leading-6 text-white/75">{business.preOrderNotice}</p>
          <a className="mt-4 flex min-h-10 items-center gap-3 text-sm text-white/90 hover:text-pink" href={business.instagram.url} target="_blank" rel="noreferrer">
            <Instagram className="text-pink" aria-hidden="true" size={18} />
            {business.instagram.handle}
          </a>
          <a className="mt-1 flex min-h-10 items-center gap-3 break-all text-sm text-white/90 hover:text-pink" href={`mailto:${business.email}`}>
            <Mail className="shrink-0 text-pink" aria-hidden="true" size={18} />
            {business.email}
          </a>
        </div>
      </div>
      <div className="border-t border-white/15 px-5 py-5 text-center text-xs text-white/70 sm:text-sm">
        {content.footer.copyright}
      </div>
    </footer>
  )
}
