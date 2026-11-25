import { useEffect, useRef, useState } from 'react'
import { content } from '../../data/content.js'
import { reviews } from '../../data/reviews.js'

export default function Reviews() {
  const [active, setActive] = useState(0)
  const carouselRef = useRef(null)

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return undefined
    const handleScroll = () => {
      const width = carousel.firstElementChild?.getBoundingClientRect()?.width
      if (!width) return
      setActive(Math.round(carousel.scrollLeft / (width + 16)))
    }
    carousel.addEventListener('scroll', handleScroll, { passive: true })
    return () => carousel.removeEventListener('scroll', handleScroll)
  }, [])

  const goTo = (index) => {
    const card = carouselRef.current?.children[index]
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }

  return (
    <section id="reviews" className="bg-cream px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-display text-3xl font-semibold text-plum sm:text-4xl">
          {content.headings.reviews}
        </h2>
        <div
          ref={carouselRef}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
          aria-label="Customer reviews"
        >
          {reviews.map((review) => (
            <article
              key={review.id}
              className="w-[85%] shrink-0 snap-start rounded-2xl border border-pink-soft bg-pink-soft/30 p-4 sm:w-[48%] lg:w-[32%]"
            >
              {review.image && (
                <img
                  src={review.image}
                  alt=""
                  className="mb-4 aspect-[4/3] w-full rounded-xl object-cover"
                  style={{ objectPosition: review.imagePosition || 'center' }}
                />
              )}
              <div className="space-y-2">
                {review.messages.map((message) => (
                  <p
                    key={message}
                    className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm leading-6 text-ink shadow-sm"
                  >
                    {message}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {reviews.map((review, index) => (
            <button
              type="button"
              key={review.id}
              onClick={() => goTo(index)}
              className={`size-11 rounded-full p-0 ${active === index ? 'ring-4 ring-pink-soft' : ''}`}
              aria-label={`Go to review ${index + 1}`}
            >
              <span className={`mx-auto block rounded-full ${active === index ? 'size-3 bg-plum' : 'size-2 bg-pink'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
