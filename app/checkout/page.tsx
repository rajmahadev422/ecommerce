"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CreditCard,
  Lock,
  ChevronRight,
  Loader2,
  Check,
  MapPin,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/ui/AuthModal";
import toast from "react-hot-toast";

type CheckoutStep = "address" | "payment" | "confirming";

export default function CheckoutPage() {
  const router = useRouter();
  const { state: cart, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<CheckoutStep>("address");
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: user?.name || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
    country: user?.address?.country || "US",
  });
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const subtotal = cart.total;
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatCardNumber = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  const formatExpiry = (v: string) => {
    const clean = v.replace(/\D/g, "").slice(0, 4);
    return clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.items.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setStep("confirming");
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((i) => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
          })),
          shippingAddress: address,
          subtotal,
          tax,
          shipping,
          total,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        toast.success("Order placed successfully!", {
          icon: "🎉",
          duration: 4000,
        });
        router.push(`/orders/${data.order._id}`);
      } else {
        toast.error(data.message || "Order failed");
        setStep("payment");
      }
    } catch {
      toast.error("Network error, please try again");
      setStep("payment");
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0 && step !== "confirming") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center page-enter">
        <h2 className="font-display text-3xl font-bold text-stone-900 dark:text-white mb-3">
          Your cart is empty
        </h2>
        <p className="text-stone-500 dark:text-zinc-400 mb-8">
          Add some products before checking out
        </p>
        <button onClick={() => router.push("/")} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 page-enter">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-white">
          Checkout
        </h1>
        {/* Steps indicator */}
        <div className="flex items-center gap-3 mt-4">
          {["address", "payment"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === s
                    ? "bg-brand-500 text-white"
                    : (step === "payment" && s === "address") ||
                        step === "confirming"
                      ? "bg-green-500 text-white"
                      : "bg-stone-100 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500"
                }`}
              >
                {(step === "payment" && s === "address") ||
                step === "confirming" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-sm font-medium capitalize ${step === s ? "text-stone-900 dark:text-white" : "text-stone-400 dark:text-zinc-500"}`}
              >
                {s}
              </span>
              {i === 0 && (
                <ChevronRight className="w-4 h-4 text-stone-300 dark:text-zinc-700" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left - Forms */}
        <div className="lg:col-span-3">
          {step === "address" && (
            <form
              onSubmit={handleAddressSubmit}
              className="card p-6 space-y-5 animate-fade-in"
            >
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-brand-500" />
                <h2 className="font-display text-xl font-bold text-stone-900 dark:text-white">
                  Shipping Address
                </h2>
              </div>
              <input
                type="text"
                placeholder="Full name"
                required
                value={address.name}
                onChange={(e) =>
                  setAddress({ ...address, name: e.target.value })
                }
                className="input-field"
              />
              <input
                type="text"
                placeholder="Street address"
                required
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
                className="input-field"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="State"
                  required
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="ZIP Code"
                  required
                  value={address.zip}
                  onChange={(e) =>
                    setAddress({ ...address, zip: e.target.value })
                  }
                  className="input-field"
                />
                <select
                  value={address.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
              {!user && (
                <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800">
                  <p className="text-sm text-brand-700 dark:text-brand-300">
                    <button
                      type="button"
                      onClick={() => setAuthOpen(true)}
                      className="font-semibold underline"
                    >
                      Sign in
                    </button>{" "}
                    to save your address and track orders easily
                  </p>
                </div>
              )}
              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Continue to Payment <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {(step === "payment" || step === "confirming") && (
            <form
              onSubmit={handlePayment}
              className="card p-6 space-y-5 animate-fade-in"
            >
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-5 h-5 text-brand-500" />
                <h2 className="font-display text-xl font-bold text-stone-900 dark:text-white">
                  Payment Details
                </h2>
                <span className="badge bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <Lock className="w-3 h-3 mr-1" /> Secure
                </span>
              </div>

              {/* Demo notice */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300">
                🧪 Demo mode — use any card number (e.g. 4242 4242 4242 4242)
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Card number"
                  value={card.number}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      number: formatCardNumber(e.target.value),
                    })
                  }
                  className="input-field font-mono tracking-widest"
                  required
                />
                <input
                  type="text"
                  placeholder="Name on card"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  className="input-field"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard({ ...card, expiry: formatExpiry(e.target.value) })
                    }
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    value={card.cvc}
                    onChange={(e) =>
                      setCard({
                        ...card,
                        cvc: e.target.value.replace(/\D/g, "").slice(0, 3),
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("address")}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" /> Pay ${total.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right - Order summary */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h3 className="font-display text-lg font-bold text-stone-900 dark:text-white mb-4">
              Order Summary
            </h3>
            <div className="space-y-3 mb-5 max-h-72 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-800 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 dark:text-white line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-sm text-stone-500 dark:text-zinc-400">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-stone-900 dark:text-white flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-stone-100 dark:border-zinc-800 pt-4">
              <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
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
              <div className="flex justify-between font-bold text-base text-stone-900 dark:text-white pt-2 border-t border-stone-100 dark:border-zinc-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
