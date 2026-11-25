import { Balloon, CakeSlice, ChefHat, GraduationCap, Gift, Truck, Utensils } from 'lucide-react'
import { content } from '../../data/content.js'
import { whatsappUrl } from '../../utils/whatsapp.js'

const services = [
  { label: 'Cakes for all occasions', icon: CakeSlice },
  { label: 'Pastries', icon: ChefHat },
  { label: 'Parfait', icon: Utensils },
  { label: 'Surprise packages', icon: Gift },
  { label: 'Balloon decorations', icon: Balloon },
  { label: 'Catering', icon: Truck },
  { label: 'Training', icon: GraduationCap },
]

export default function ServicesBand() {
  return (
    <section className="bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-display text-3xl font-semibold text-plum sm:text-4xl">
          {content.headings.services}
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {services.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-pink-soft bg-pink-soft/35 px-3 text-center"
            >
              <Icon className="text-plum" aria-hidden="true" size={27} />
              <p className="mt-3 text-xs font-semibold leading-5 text-ink sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid items-center gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-magenta-deep to-magenta p-5 text-white sm:p-7 md:grid-cols-[1fr_200px]">
          <div>
            <p className="rounded-full bg-pink px-3 py-1 text-xs font-semibold text-plum inline-block">Catering</p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/90">
              Ask us about catering for your celebration or event.
            </p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-pink px-5 font-semibold text-plum"
            >
              Ask on WhatsApp
            </a>
          </div>
          <img
            src="/images/catering-jollof-rice.jpg"
            alt="Jollof rice and chicken catering box"
            className="mx-auto size-44 rounded-full border-[7px] border-pink object-cover"
          />
        </div>
      </div>
    </section>
  )
}
