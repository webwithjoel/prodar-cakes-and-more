import { ArrowDown, MessageCircle } from 'lucide-react'
import { content } from '../../data/content.js'
import { whatsappUrl } from '../../utils/whatsapp.js'

export default function Hero() {
  return (
    <section
      id="home"
      className="overflow-hidden bg-gradient-to-br from-magenta-deep to-magenta text-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-[1.15fr_0.85fr] md:gap-6 md:py-20 lg:px-12 lg:py-24">
        <div className="relative z-10 text-center md:text-left">
          <img
            className="mx-auto mb-7 h-14 w-auto max-w-[210px] object-contain md:hidden"
            src="/images/logo-white.png"
            alt="Prodar's Cakes and More"
          />
          <span className="inline-flex min-h-9 items-center rounded-full bg-pink px-4 py-1 text-xs font-semibold text-plum-dark sm:text-sm">
            {content.hero.eyebrow}
          </span>
          <h1 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl md:mx-0 md:text-5xl lg:text-6xl">
            {content.hero.headline}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/90 sm:text-base sm:leading-8 md:mx-0">
            {content.hero.description}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-pink px-6 font-semibold text-plum-dark transition hover:bg-white"
              href="#products"
            >
              {content.hero.shopButton}
              <ArrowDown aria-hidden="true" size={17} />
            </a>
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/60 px-6 font-semibold text-white transition hover:bg-white/10"
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" size={18} />
              {content.hero.whatsappButton}
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex h-[260px] w-full max-w-[420px] items-center justify-center sm:h-[340px] md:h-[370px] lg:h-[420px]">
          <div className="absolute left-[3%] top-[6%] size-16 rounded-full bg-pink/20 blur-xl sm:size-24" />
          <div className="absolute bottom-[5%] right-[4%] size-24 rounded-full bg-white/15 blur-2xl sm:size-32" />
          <div className="absolute left-[4%] top-[16%] size-[170px] overflow-hidden rounded-full border-[7px] border-pink shadow-2xl sm:size-[220px] sm:border-[9px] md:left-[0%] md:top-[11%] md:size-[230px] lg:size-[270px]">
            <img className="size-full object-cover" src="/images/cake-wedding-two-tier.jpg" alt="White two-tier wedding cake with gold details" />
          </div>
          <div className="absolute bottom-[4%] right-[1%] size-[145px] overflow-hidden rounded-full border-[7px] border-pink shadow-2xl sm:size-[190px] sm:border-[9px] md:bottom-[4%] md:right-[1%] md:size-[190px] lg:size-[220px]">
            <img className="size-full object-cover" src="/images/parfait-cup-hero.jpg" alt="Layered yoghurt parfait topped with granola and fruit" />
          </div>
          <div className="absolute right-[8%] top-[3%] hidden -rotate-6 rounded-full bg-white px-4 py-2 font-script text-sm text-plum shadow-lg sm:block">
            Made with love
          </div>
        </div>
      </div>
    </section>
  )
}
