'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { ShoppingBag, Sun, Moon, User, Menu, X, Search, Package, LogOut, ChevronDown } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import CartDrawer from '@/components/ui/CartDrawer'
import AuthModal from '@/components/ui/AuthModal'

const CATEGORIES = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Beauty', 'Books']

export default function Navbar() {
  const { theme, setTheme }       = useTheme()
  const { state: cartState }      = useCart()
  const { user, logout }          = useAuth()
  const [mounted, setMounted]     = useState(false)
  const [cartOpen, setCartOpen]   = useState(false)
  const [authOpen, setAuthOpen]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled]   = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg shadow-sm border-b border-stone-200/50 dark:border-zinc-800/50'
          : 'bg-white dark:bg-zinc-950 border-b border-stone-100 dark:border-zinc-900'
      }`}>
        {/* Promo bar */}
        <div className="bg-brand-500 text-white text-center py-1.5 text-xs font-medium tracking-wide">
          Free shipping on orders over $50 · Use code <strong>LUXE10</strong> for 10% off
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center group-hover:bg-brand-600 transition-colors shadow-sm">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-stone-900 dark:text-white tracking-tight">
                LUXE
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-5">
              {CATEGORIES.slice(0, 5).map(cat => (
                <Link
                  key={cat}
                  href={`/?category=${encodeURIComponent(cat)}`}
                  className="text-sm font-medium text-stone-600 dark:text-zinc-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <Link href="/" className="p-2 rounded-xl text-stone-500 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors">
                <Search className="w-5 h-5" />
              </Link>

              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-xl text-stone-500 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark'
                    ? <Sun className="w-5 h-5 text-amber-400" />
                    : <Moon className="w-5 h-5" />}
                </button>
              )}

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-xl text-stone-500 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label={`Cart (${cartState.itemCount} items)`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-0.5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-in">
                    {cartState.itemCount > 9 ? '9+' : cartState.itemCount}
                  </span>
                )}
              </button>

              {/* User menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-sm">
                      <span className="text-xs font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-stone-700 dark:text-zinc-300 max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 card shadow-xl border border-stone-100 dark:border-zinc-800 overflow-hidden z-20 animate-fade-in">
                        <div className="px-4 py-3 border-b border-stone-100 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-800/50">
                          <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-stone-400 dark:text-zinc-500 truncate mt-0.5">{user.email}</p>
                        </div>
                        {[
                          { href: '/profile', icon: <User className="w-4 h-4" />, label: 'My Profile' },
                          { href: '/orders',  icon: <Package className="w-4 h-4" />, label: 'My Orders' },
                        ].map(item => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 dark:text-zinc-300 hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <span className="text-brand-500">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                        <div className="border-t border-stone-100 dark:border-zinc-800">
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false) }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="hidden sm:flex items-center gap-2 ml-1 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 active:scale-95 transition-all shadow-sm"
                >
                  <User className="w-4 h-4" />
                  Sign in
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="lg:hidden p-2 rounded-xl text-stone-500 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              <Link href="/" className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-900 dark:text-white hover:bg-stone-50 dark:hover:bg-zinc-900 transition-colors" onClick={() => setMobileOpen(false)}>
                All Products
              </Link>
              {CATEGORIES.map(cat => (
                <Link
                  key={cat}
                  href={`/?category=${encodeURIComponent(cat)}`}
                  className="block px-3 py-2.5 rounded-xl text-sm text-stone-600 dark:text-zinc-400 hover:bg-stone-50 dark:hover:bg-zinc-900 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={() => { setAuthOpen(true); setMobileOpen(false) }}
                  className="w-full mt-2 btn-primary"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal  open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
