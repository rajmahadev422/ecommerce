"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import OrderTimeline from "@/components/ui/OrderTimeline";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  items: Array<{
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  statusHistory: Array<{ status: string; timestamp: string; note?: string }>;
  createdAt: string;
}

// Next.js 15: params is now a Promise
export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } catch {}
  };

  useEffect(() => {
    fetchOrder().then(() => setLoading(false));
  }, [id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrder();
    setTimeout(() => setRefreshing(false), 600);
    toast.success("Order status refreshed");
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order!._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Order ID copied!");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-10 w-48 skeleton rounded-xl" />
            <div className="card p-6 space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-16 skeleton rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="card p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 skeleton rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center page-enter">
        <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-white">
          Order not found
        </h2>
        <Link href="/orders" className="btn-primary mt-4 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  const paymentColors: Record<string, string> = {
    pending: "text-amber-500",
    paid: "text-green-500",
    failed: "text-red-500",
    refunded: "text-blue-500",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 page-enter">
      <button
        onClick={() => router.push("/orders")}
        className="flex items-center gap-2 text-sm text-stone-500 dark:text-zinc-400 hover:text-brand-500 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </button>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-white">
            Order Details
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-stone-400 dark:text-zinc-500 font-mono text-sm">
              #{order._id.slice(-8).toUpperCase()}
            </span>
            <button
              onClick={copyOrderId}
              className="p-1 text-stone-400 hover:text-brand-500 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <p className="text-stone-500 dark:text-zinc-400 text-sm mt-0.5">
            Placed{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 btn-secondary text-sm"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh status
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Tracking timeline */}
          <div className="card p-6">
            <h2 className="font-display text-xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-500" />
              Order Tracking
            </h2>
            <OrderTimeline
              status={
                order.status as Parameters<typeof OrderTimeline>[0]["status"]
              }
              statusHistory={
                order.statusHistory as Parameters<
                  typeof OrderTimeline
                >[0]["statusHistory"]
              }
            />

            {order.trackingNumber && (
              <div className="mt-4 p-3 rounded-xl bg-stone-50 dark:bg-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400 dark:text-zinc-500 font-medium">
                    TRACKING NUMBER
                  </p>
                  <p className="font-mono text-sm font-bold text-stone-900 dark:text-white mt-0.5">
                    {order.trackingNumber}
                  </p>
                </div>
              </div>
            )}

            {order.estimatedDelivery &&
              order.status !== "delivered" &&
              order.status !== "cancelled" && (
                <div className="mt-3 p-3 rounded-xl bg-brand-50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/30">
                  <p className="text-sm text-brand-700 dark:text-brand-300">
                    📦 Estimated delivery:{" "}
                    <strong>
                      {new Date(order.estimatedDelivery).toLocaleDateString(
                        "en-US",
                        { weekday: "long", month: "long", day: "numeric" },
                      )}
                    </strong>
                  </p>
                </div>
              )}
          </div>

          {/* Items */}
          <div className="card p-6">
            <h2 className="font-display text-xl font-bold text-stone-900 dark:text-white mb-4">
              Items ({order.items.length})
            </h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-center py-3 border-b border-stone-50 dark:border-zinc-800 last:border-0 last:pb-0"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-800 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-medium text-stone-900 dark:text-white hover:text-brand-500 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-stone-500 dark:text-zinc-400 mt-0.5">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-stone-900 dark:text-white flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Summary */}
          <div className="card p-5">
            <h3 className="font-display text-lg font-bold text-stone-900 dark:text-white mb-4">
              Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                <span>Shipping</span>
                <span className={order.shipping === 0 ? "text-green-500" : ""}>
                  {order.shipping === 0
                    ? "FREE"
                    : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-stone-900 dark:text-white pt-2 border-t border-stone-100 dark:border-zinc-800">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-stone-400" />
              <div>
                <p className="text-xs text-stone-400 dark:text-zinc-500">
                  Payment
                </p>
                <p
                  className={`text-sm font-semibold capitalize ${paymentColors[order.paymentStatus] || "text-stone-600"}`}
                >
                  {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-brand-500" />
              <h3 className="font-display text-lg font-bold text-stone-900 dark:text-white">
                Shipping To
              </h3>
            </div>
            <div className="text-sm text-stone-600 dark:text-zinc-400 space-y-0.5">
              <p className="font-semibold text-stone-900 dark:text-white">
                {order.shippingAddress.name}
              </p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zip}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Link href="/" className="btn-primary w-full text-center block">
              Continue Shopping
            </Link>
            {order.status === "delivered" && (
              <button className="btn-secondary w-full">Write a Review</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
