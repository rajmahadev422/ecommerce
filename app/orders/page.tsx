'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import OrderTimeline from '@/components/ui/OrderTimeline'

interface Order {
  _id: string
  items: Array<{ name: string; image: string; price: number; quantity: number }>
  total: number
  status: string
  paymentStatus: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400',
  confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  processing: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  shipped: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  out_for_delivery: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  delivered: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
}

const statusLabels: Record<string, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
      return
    }
    if (user) {
      fetch('/api/orders')
        .then(r => r.json())
        .then(d => { setOrders(d.orders || []); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="h-10 w-48 skeleton rounded-xl mb-8" />
        {[1,2,3].map(i => (
          <div key={i} className="card p-6 mb-4 space-y-3">
            <div className="h-5 w-1/3 skeleton rounded-lg" />
            <div className="h-4 w-1/2 skeleton rounded-lg" />
            <div className="h-16 skeleton rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 page-enter">
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-6 h-6 text-brand-500" />
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-white">My Orders</h1>
          <p className="text-stone-500 dark:text-zinc-400 text-sm mt-0.5">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 card">
          <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-9 h-9 text-stone-300 dark:text-zinc-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-stone-700 dark:text-zinc-300">No orders yet</h2>
          <p className="text-stone-400 dark:text-zinc-500 mt-2 mb-6">Your orders will appear here once you make a purchase</p>
          <Link href="/" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} href={`/orders/${order._id}`} className="block card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
              <div className="p-5">
                {/* Order header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-stone-400 dark:text-zinc-500 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-stone-500 dark:text-zinc-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${statusColors[order.status] || statusColors.pending} text-xs font-semibold px-3 py-1`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400 dark:text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Product thumbnails */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {order.items.slice(0, 4).map((item, i) => (
                    <div key={i} className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-800 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      {item.quantity > 1 && (
                        <span className="absolute bottom-0 right-0 bg-brand-500 text-white text-[10px] font-bold px-1 rounded-tl-md">
                          ×{item.quantity}
                        </span>
                      )}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-14 h-14 rounded-xl bg-stone-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-stone-500 dark:text-zinc-400">
                      +{order.items.length - 4}
                    </div>
                  )}
                  <div className="flex flex-col justify-center ml-auto text-right">
                    <p className="text-xs text-stone-400 dark:text-zinc-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    <p className="text-lg font-bold text-stone-900 dark:text-white">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Mini timeline */}
                <div className="pt-3 border-t border-stone-100 dark:border-zinc-800">
                  <OrderTimeline status={order.status as any} compact />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
