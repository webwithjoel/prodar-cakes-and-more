import { BadgeCheck, Clock3, Instagram, CalendarDays } from 'lucide-react'
import { content } from '../../data/content.js'

const icons = [BadgeCheck, CalendarDays, Clock3, Instagram]

export default function StatStrip() {
  return (
    <section className="border-b border-pink-soft bg-white" aria-label="Business details">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {content.stats.map((stat, index) => {
          const Icon = icons[index]
          return (
            <div
              className="flex min-h-[100px] items-center justify-center gap-3 border-b border-r border-pink-soft px-3 py-5 text-center last:border-r-0 odd:border-r md:border-b-0 md:py-6"
              key={stat.label}
            >
              <Icon className="hidden shrink-0 text-plum sm:block" aria-hidden="true" size={23} />
              <div>
                <p className="font-display text-base font-semibold text-plum sm:text-lg">{stat.value}</p>
                <p className="mt-1 text-[11px] text-ink/70 sm:text-xs">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
