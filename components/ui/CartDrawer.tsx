'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { state, removeItem, updateQuantity } = useCart()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const tax      = state.total * 0.08
  const shipping = state.total >= 50 ? 0 : state.total > 0 ? 9.99 : 0
  const total    = state.total + tax + shipping

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col bg-white dark:bg-zinc-900 shadow-2xl animate-slide-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-brand-500" />
            <h2 className="font-display text-xl font-bold text-stone-900 dark:text-white">Your Cart</h2>
            {state.itemCount > 0 && (
              <span className="badge bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
                {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors text-stone-400"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-stone-300 dark:text-zinc-600" />
              </div>
              <div>
                <p className="font-semibold text-stone-700 dark:text-zinc-300 text-lg">Your cart is empty</p>
                <p className="text-stone-400 dark:text-zinc-500 text-sm mt-1">Add items to get started!</p>
              </div>
              <button onClick={onClose} className="btn-primary">Continue Shopping</button>
            </div>
          ) : (
            <div className="space-y-3">
              {state.items.map(item => (
                <div key={item.productId} className="flex gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-zinc-800/50 group">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-900 dark:text-white line-clamp-2 leading-tight">{item.name}</p>
                    <p className="text-brand-500 font-bold mt-1 text-sm">${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-0.5 bg-white dark:bg-zinc-700 rounded-lg border border-stone-200 dark:border-zinc-600 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-stone-100 dark:hover:bg-zinc-600 disabled:opacity-30 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-sm font-bold text-stone-900 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-stone-100 dark:hover:bg-zinc-600 disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 rounded-lg text-stone-300 dark:text-zinc-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-stone-100 dark:border-zinc-800 px-6 py-5 space-y-4 bg-white dark:bg-zinc-900">
            <div className="space-y-2 text-sm">
              {[
                { label: 'Subtotal', value: `$${state.total.toFixed(2)}` },
                { label: 'Tax (8%)',  value: `$${tax.toFixed(2)}` },
                {
                  label: 'Shipping',
                  value: shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`,
                  green: shipping === 0,
                },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-stone-600 dark:text-zinc-400">
                  <span>{row.label}</span>
                  <span className={row.green ? 'text-green-500 font-medium' : ''}>{row.value}</span>
                </div>
              ))}
              {shipping > 0 && (
                <p className="text-xs text-stone-400 dark:text-zinc-500 bg-stone-50 dark:bg-zinc-800 rounded-lg px-3 py-1.5">
                  Add ${(50 - state.total).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="flex justify-between font-bold text-base text-stone-900 dark:text-white pt-2 border-t border-stone-100 dark:border-zinc-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full btn-primary"
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-stone-500 dark:text-zinc-400 hover:text-brand-500 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
