"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { state, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  const tax = state.total * 0.08;
  const shipping = state.total > 50 ? 0 : state.total > 0 ? 9.99 : 0;
  const total = state.total + tax + shipping;

  if (state.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center page-enter">
        <div className="w-24 h-24 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-stone-300 dark:text-zinc-600" />
        </div>
        <h2 className="font-display text-3xl font-bold text-stone-900 dark:text-white mb-3">
          Your cart is empty
        </h2>
        <p className="text-stone-500 dark:text-zinc-400 mb-8">
          Looks like you haven&apos;t added anything yet
        </p>
        <Link href="/" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 page-enter">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors text-stone-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-white">
          Cart{" "}
          <span className="text-stone-400 dark:text-zinc-500 text-xl font-sans font-normal">
            ({state.itemCount} items)
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <div
              key={item.productId}
              className="card p-4 flex gap-4 group animate-fade-in"
            >
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-800 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/products/${item.productId}`}
                    className="font-semibold text-stone-900 dark:text-white hover:text-brand-500 transition-colors line-clamp-2 text-sm leading-snug"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-1.5 rounded-lg text-stone-300 dark:text-zinc-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-brand-500 font-bold mt-1">
                  ${item.price.toFixed(2)}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 bg-stone-100 dark:bg-zinc-800 rounded-xl p-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-stone-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.stock}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-bold text-stone-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-display text-xl font-bold text-stone-900 dark:text-white mb-5">
              Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                <span>Subtotal ({state.itemCount} items)</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                <span>Shipping</span>
                <span
                  className={shipping === 0 ? "text-green-500 font-medium" : ""}
                >
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-stone-400 dark:text-zinc-500 bg-stone-50 dark:bg-zinc-800 rounded-lg p-2">
                  Add ${(50 - state.total).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="flex justify-between font-bold text-lg text-stone-900 dark:text-white pt-3 border-t border-stone-100 dark:border-zinc-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full btn-primary mt-5"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="block text-center text-sm text-stone-500 dark:text-zinc-400 hover:text-brand-500 transition-colors mt-3"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
