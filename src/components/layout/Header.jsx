import { useState } from 'react'
import { Menu, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { content } from '../../data/content.js'
import MobileMenu from './MobileMenu.jsx'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { count } = useCart()

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-pink-soft bg-cream/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a className="flex min-h-11 items-center" href="#home" aria-label="Prodar's Cakes and More home">
            <img className="h-12 w-auto max-w-[190px] object-contain" src="/images/logo-plum.png" alt="Prodar's Cakes and More" />
          </a>
          <div className="flex items-center gap-2">
            <button
              className="relative grid size-11 place-items-center rounded-full text-plum transition hover:bg-pink-soft"
              type="button"
              aria-label={`${content.navigation.cart}${count ? `, ${count} items` : ''}`}
            >
              <ShoppingBag aria-hidden="true" size={22} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-badge-red text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              className="grid size-11 place-items-center rounded-full bg-pink-soft text-plum transition hover:bg-pink"
              type="button"
              aria-label={content.navigation.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu aria-hidden="true" size={23} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
