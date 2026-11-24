import { content } from '../../data/content.js'
import { whatsappUrl } from '../../utils/whatsapp.js'

export default function AnnouncementBar() {
  const { badge, message } = content.announcement
  return (
    <div className="bg-plum px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
      <a
        className="inline-flex min-h-8 flex-wrap items-center justify-center gap-2"
        href={whatsappUrl()}
        target="_blank"
        rel="noreferrer"
      >
        <span className="rounded-full bg-badge-red px-3 py-1 text-[10px] font-bold tracking-wider text-white">
          {badge}
        </span>
        <span>{message}</span>
      </a>
    </div>
  )
}
