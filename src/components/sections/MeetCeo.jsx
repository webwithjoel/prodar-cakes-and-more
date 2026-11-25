import { MessageCircle } from 'lucide-react'
import { content } from '../../data/content.js'
import { whatsappUrl } from '../../utils/whatsapp.js'

export default function MeetCeo() {
  return (
    <section id="ceo" className="bg-pink-soft/40 px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2">
        <div className="relative mx-auto w-full max-w-[440px]">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl border-[8px] border-pink shadow-xl">
            <img
              src="/images/ceo-portrait.jpg"
              alt="Prodar's CEO and Head Baker"
              className="size-full object-cover"
            />
          </div>
          <span className="absolute bottom-5 left-1/2 min-h-11 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo px-4 py-3 text-xs font-semibold text-white shadow-lg">
            CEO &amp; Head Baker
          </span>
        </div>
        <div>
          <h2 className="font-display text-3xl font-semibold text-plum sm:text-4xl">
            {content.headings.ceo}
          </h2>
          <p className="mt-5 text-sm leading-7 text-ink/80 sm:text-base">
            {content.ceoStory}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['Cakes', 'Pastries', 'Training'].map((chip) => (
              <span key={chip} className="rounded-full bg-pink px-4 py-2 text-xs font-semibold text-plum">
                {chip}
              </span>
            ))}
          </div>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-plum px-6 font-semibold text-white"
          >
            <MessageCircle aria-hidden="true" size={18} />
            Message me on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
