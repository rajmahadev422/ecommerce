'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

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
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem }       = useCart()
  const [adding, setAdding] = useState(false)
  const [wished, setWished] = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock === 0 || adding) return
    setAdding(true)
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity: 1,
      stock: product.stock,
    })
    setTimeout(() => setAdding(false), 800)
  }

  const imageSrc = product.images[0] ||
    `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}`

  return (
    <Link href={`/products/${product._id}`} className="group product-card block">
      <div className="card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-stone-100 dark:bg-zinc-800">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover product-card-img"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="badge bg-red-500 text-white font-bold shadow-sm">-{discount}%</span>
            )}
            {product.stock === 0 && (
              <span className="badge bg-stone-700 text-white">Out of stock</span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="badge bg-amber-500 text-white">Only {product.stock} left</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            onClick={e => { e.preventDefault(); setWished(v => !v) }}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 transition-colors ${wished ? 'fill-red-500 text-red-500' : 'text-stone-500'}`} />
          </button>

          {/* Quick add — desktop hover */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-3 flex items-center justify-center gap-2 font-semibold text-sm transition-colors ${
                adding
                  ? 'bg-green-500 text-white'
                  : 'bg-brand-500 hover:bg-brand-600 text-white'
              } disabled:bg-stone-300 disabled:cursor-not-allowed dark:disabled:bg-zinc-700`}
            >
              <ShoppingCart className="w-4 h-4" />
              {adding ? 'Added!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-stone-400 dark:text-zinc-500 uppercase tracking-wide mb-1 font-medium">{product.brand}</p>
          <h3 className="font-semibold text-stone-900 dark:text-white text-sm leading-snug line-clamp-2 mb-2 group-hover:text-brand-500 transition-colors">
            {product.name}
          </h3>

          {/* Stars */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-200 dark:text-zinc-700'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-stone-400 dark:text-zinc-500">({product.reviewCount.toLocaleString()})</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-stone-900 dark:text-white">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 dark:text-zinc-500 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            {/* Mobile quick-add */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`sm:hidden p-2 rounded-xl transition-all ${
                adding
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                  : 'bg-brand-50 dark:bg-brand-900/30 text-brand-500 hover:bg-brand-100'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
