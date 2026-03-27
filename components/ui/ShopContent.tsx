'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, X, Sparkles, ArrowRight } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  brand: string
  rating: number
  reviewCount: number
  stock: number
  featured: boolean
}

const CATEGORIES = ['all', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Beauty', 'Books', 'Toys']

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 skeleton rounded-full" />
        <div className="h-4 skeleton rounded-full" />
        <div className="h-4 w-2/3 skeleton rounded-full" />
        <div className="h-6 w-1/2 skeleton rounded-full" />
      </div>
    </div>
  )
}

export default function ShopContent() {
  const searchParams  = useSearchParams()
  const router        = useRouter()
  const [products, setProducts]       = useState<Product[]>([])
  const [featured, setFeatured]       = useState<Product[]>([])
  const [loading, setLoading]         = useState(true)
  const [total, setTotal]             = useState(0)
  const [page, setPage]               = useState(1)
  const [pages, setPages]             = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch]           = useState('')
  const [category, setCategory]       = useState(searchParams.get('category') || 'all')

  // Sync category from URL
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategory(cat)
    else setCategory('all')
  }, [searchParams])

  const fetchFeatured = useCallback(async () => {
    try {
      const res  = await fetch('/api/products?featured=true&limit=4')
      const data = await res.json()
      setFeatured(data.products || [])
    } catch { /* ignore */ }
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== 'all') params.set('category', category)
      if (search) params.set('search', search)
      params.set('page', String(page))
      params.set('limit', '12')

      const res  = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data.products || [])
      setTotal(data.total   || 0)
      setPages(data.pages   || 1)
    } catch { setProducts([]) }
    finally  { setLoading(false) }
  }, [category, search, page])

  useEffect(() => { fetchFeatured() }, [fetchFeatured])
  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const clearSearch = () => { setSearchInput(''); setSearch(''); setPage(1) }

  const handleCategory = (cat: string) => {
    setCategory(cat)
    setPage(1)
    router.push(cat === 'all' ? '/' : `/?category=${encodeURIComponent(cat)}`)
  }

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-stone-950 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-500/20 rounded-full filter blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-700/20 rounded-full filter blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            New arrivals just dropped
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Shop the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-300">
              Extraordinary
            </span>
          </h1>
          <p className="text-stone-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Curated products from the world&apos;s best brands, delivered to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-base px-8 py-4 inline-flex items-center justify-center gap-2 shadow-lg shadow-brand-900/40"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </button>
            <Link href="/orders" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white text-base font-medium hover:bg-white/20 transition-colors">
              Track Orders
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && !search && category === 'all' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-stone-900 dark:text-white">Featured Picks</h2>
            <p className="text-stone-500 dark:text-zinc-400 mt-1">Handpicked for you this season</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Product listing */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="input-field pl-11 pr-24"
            />
            {searchInput && (
              <button type="button" onClick={clearSearch} className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            )}
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-brand-500 text-white text-xs font-semibold rounded-lg hover:bg-brand-600 transition-colors">
              Search
            </button>
          </form>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  category === cat
                    ? 'bg-brand-500 text-white shadow-sm shadow-brand-200 dark:shadow-brand-900/30'
                    : 'bg-white dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 border border-stone-200 dark:border-zinc-700 hover:border-brand-300 dark:hover:border-brand-700'
                }`}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}
          </div>

          {/* Result count */}
          {!loading && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-500 dark:text-zinc-400">
                {search
                  ? <><strong className="text-stone-900 dark:text-white">{total}</strong> results for &quot;{search}&quot;</>
                  : <><strong className="text-stone-900 dark:text-white">{total}</strong> products</>}
              </p>
              {search && (
                <button onClick={clearSearch} className="text-sm text-brand-500 hover:text-brand-600 flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-9 h-9 text-stone-300 dark:text-zinc-600" />
            </div>
            <h3 className="font-display text-xl font-bold text-stone-700 dark:text-zinc-300">No products found</h3>
            <p className="text-stone-400 dark:text-zinc-500 mt-2">Try adjusting your filters or search terms</p>
            <button
              onClick={() => { clearSearch(); handleCategory('all') }}
              className="btn-primary mt-6"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-12 flex-wrap">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
                >
                  ← Previous
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1)
                  .filter(p => Math.abs(p - page) <= 2)
                  .map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                        p === page ? 'bg-brand-500 text-white' : 'btn-secondary'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                <button
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
