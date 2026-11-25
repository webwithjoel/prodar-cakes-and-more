import { useEffect, useState } from 'react'
import { BadgeCheck, X } from 'lucide-react'
import { business } from '../../data/business.js'
import { content } from '../../data/content.js'

export default function Certifications() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const close = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  return (
    <>
      <section id="certifications" className="bg-pink-soft/35 px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-3xl font-semibold text-plum sm:text-4xl">
            {content.headings.certifications}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mx-auto mt-8 flex w-full max-w-2xl flex-col items-center rounded-2xl border border-pink-soft bg-white p-5 text-center shadow-sm sm:flex-row sm:text-left"
          >
            <img
              src="/images/cac-certificate.jpg"
              alt="CAC certificate thumbnail"
              className="size-36 rounded-xl object-cover"
            />
            <div className="mt-5 sm:ml-6 sm:mt-0">
              <BadgeCheck className="mx-auto text-plum sm:mx-0" aria-hidden="true" size={28} />
              <p className="mt-3 font-display text-xl font-semibold text-plum">
                Registered with the Corporate Affairs Commission
              </p>
              <p className="mt-2 text-sm text-ink/75">BN {business.registration.number}</p>
              <p className="mt-1 text-sm text-ink/75">Registered {business.registration.registeredOn}</p>
            </div>
          </button>
        </div>
      </section>
      {open && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-ink/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="CAC certificate"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="fixed right-4 top-4 z-10 grid size-12 place-items-center rounded-full bg-white text-plum"
            aria-label="Close certificate"
          >
            <X aria-hidden="true" size={22} />
          </button>
          <img
            src="/images/cac-certificate.jpg"
            alt="Full CAC certificate"
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
          />
        </div>
      )}
    </>
  )
}
