'use client'

import { CheckCircle2, Circle, Package, Truck, MapPin, Home, XCircle, Clock } from 'lucide-react'

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled'

interface StatusStep {
  key: OrderStatus
  label: string
  description: string
  icon: React.ReactNode
}

const steps: StatusStep[] = [
  {
    key: 'pending',
    label: 'Order Placed',
    description: 'We received your order',
    icon: <Clock className="w-4 h-4" />,
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    description: 'Payment confirmed',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  {
    key: 'processing',
    label: 'Processing',
    description: 'Being prepared',
    icon: <Package className="w-4 h-4" />,
  },
  {
    key: 'shipped',
    label: 'Shipped',
    description: 'On its way to you',
    icon: <Truck className="w-4 h-4" />,
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    description: 'With the courier',
    icon: <MapPin className="w-4 h-4" />,
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Enjoy your purchase!',
    icon: <Home className="w-4 h-4" />,
  },
]

const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered']

interface OrderTimelineProps {
  status: OrderStatus
  statusHistory?: Array<{ status: OrderStatus; timestamp: string; note?: string }>
  compact?: boolean
}

export default function OrderTimeline({ status, statusHistory, compact = false }: OrderTimelineProps) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
          <XCircle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <p className="font-semibold text-red-700 dark:text-red-400">Order Cancelled</p>
          <p className="text-sm text-red-500 dark:text-red-500/70">This order has been cancelled</p>
        </div>
      </div>
    )
  }

  const currentIndex = statusOrder.indexOf(status)

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {steps.map((step, idx) => {
          const stepIndex = statusOrder.indexOf(step.key)
          const isDone = stepIndex <= currentIndex
          const isActive = step.key === status
          return (
            <div key={step.key} className="flex items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white ring-4 ring-brand-100 dark:ring-brand-900/50 scale-110'
                    : isDone
                    ? 'bg-green-500 text-white'
                    : 'bg-stone-100 dark:bg-zinc-800 text-stone-300 dark:text-zinc-600'
                }`}
              >
                {isDone && !isActive ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  step.icon
                )}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-6 mx-0.5 rounded-full transition-colors ${
                    stepIndex < currentIndex ? 'bg-green-400' : 'bg-stone-200 dark:bg-zinc-700'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {steps.map((step, idx) => {
        const stepIndex = statusOrder.indexOf(step.key)
        const isDone = stepIndex < currentIndex
        const isActive = step.key === status
        const isPending = stepIndex > currentIndex
        const historyEntry = statusHistory?.find((h) => h.status === step.key)

        return (
          <div key={step.key} className="relative flex gap-4">
            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div
                className={`timeline-connector rounded-full transition-colors duration-500 ${
                  isDone ? 'bg-green-400' : 'bg-stone-200 dark:bg-zinc-700'
                }`}
              />
            )}

            {/* Icon */}
            <div
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                isActive
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-200 dark:shadow-brand-900/50 scale-110'
                  : isDone
                  ? 'bg-green-500 text-white'
                  : 'bg-stone-100 dark:bg-zinc-800 text-stone-300 dark:text-zinc-600'
              }`}
            >
              {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
              {isActive && (
                <span className="absolute inset-0 rounded-full bg-brand-400 animate-ping opacity-30" />
              )}
            </div>

            {/* Content */}
            <div className={`pb-6 flex-1 ${idx === steps.length - 1 ? 'pb-0' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className={`font-semibold text-sm ${
                      isActive
                        ? 'text-brand-600 dark:text-brand-400'
                        : isDone
                        ? 'text-stone-900 dark:text-white'
                        : 'text-stone-400 dark:text-zinc-600'
                    }`}
                  >
                    {step.label}
                    {isActive && (
                      <span className="ml-2 badge bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 text-[10px]">
                        Current
                      </span>
                    )}
                  </p>
                  <p className={`text-xs mt-0.5 ${isPending ? 'text-stone-300 dark:text-zinc-700' : 'text-stone-500 dark:text-zinc-400'}`}>
                    {step.description}
                  </p>
                  {historyEntry?.note && (
                    <p className="text-xs mt-1 text-stone-400 dark:text-zinc-500 italic">{historyEntry.note}</p>
                  )}
                </div>
                {historyEntry && (
                  <span className="text-xs text-stone-400 dark:text-zinc-500 flex-shrink-0">
                    {new Date(historyEntry.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
