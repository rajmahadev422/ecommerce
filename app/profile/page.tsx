"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Edit3,
  Save,
  X,
  ChevronRight,
  Calendar,
  ShoppingBag,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  items: Array<{
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400",
  confirmed: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
  processing: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
  shipped: "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
  out_for_delivery: "bg-orange-100 dark:bg-orange-900/30 text-orange-600",
  delivered: "bg-green-100 dark:bg-green-900/30 text-green-600",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-600",
};

const statusLabels: Record<string, string> = {
  out_for_delivery: "Out for Delivery",
};

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      street: user.address?.street || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      zip: user.address?.zip || "",
      country: user.address?.country || "US",
    });
    fetch("/api/orders?limit=5")
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders || []);
        setOrdersLoading(false);
      })
      .catch(() => setOrdersLoading(false));
  }, [user, router]);

  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: {
            street: form.street,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
          },
        }),
      });
      if (res.ok) {
        await refreshUser();
        setEditing(false);
        toast.success("Profile updated!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 page-enter">
      <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-white mb-8">
        My Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="md:col-span-1 space-y-5">
          {/* Avatar & basic */}
          <div className="card p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-200 dark:shadow-brand-900/30">
              <span className="text-4xl font-bold text-white font-display">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-stone-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-stone-500 dark:text-zinc-400 text-sm mt-1">
              {user.email}
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-stone-400 dark:text-zinc-500">
              <Calendar className="w-3.5 h-3.5" />
              Member since {memberSince}
            </div>
          </div>

          {/* Stats */}
          <div className="card p-5 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold font-display text-stone-900 dark:text-white">
                {orders.length}
              </p>
              <p className="text-xs text-stone-400 dark:text-zinc-500 mt-0.5">
                Orders
              </p>
            </div>
            <div className="text-center border-l border-stone-100 dark:border-zinc-800">
              <p className="text-2xl font-bold font-display text-stone-900 dark:text-white">
                ${totalSpent.toFixed(0)}
              </p>
              <p className="text-xs text-stone-400 dark:text-zinc-500 mt-0.5">
                Total Spent
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="card overflow-hidden">
            <Link
              href="/orders"
              className="flex items-center justify-between px-5 py-3.5 hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors border-b border-stone-50 dark:border-zinc-800"
            >
              <div className="flex items-center gap-3 text-sm font-medium text-stone-700 dark:text-zinc-300">
                <Package className="w-4 h-4 text-brand-500" /> All Orders
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300" />
            </Link>
            <Link
              href="/"
              className="flex items-center justify-between px-5 py-3.5 hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors border-b border-stone-50 dark:border-zinc-800"
            >
              <div className="flex items-center gap-3 text-sm font-medium text-stone-700 dark:text-zinc-300">
                <ShoppingBag className="w-4 h-4 text-brand-500" /> Shop
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300" />
            </Link>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal info */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-bold text-stone-900 dark:text-white">
                Personal Info
              </h3>
              {editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 dark:text-zinc-400 mb-1.5">
                      Full Name
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 dark:text-zinc-400 mb-1.5">
                      Phone
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="input-field"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 dark:text-zinc-400 mb-1.5">
                    Street Address
                  </label>
                  <input
                    value={form.street}
                    onChange={(e) =>
                      setForm({ ...form, street: e.target.value })
                    }
                    className="input-field"
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 dark:text-zinc-400 mb-1.5">
                      City
                    </label>
                    <input
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 dark:text-zinc-400 mb-1.5">
                      State
                    </label>
                    <input
                      value={form.state}
                      onChange={(e) =>
                        setForm({ ...form, state: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 dark:text-zinc-400 mb-1.5">
                      ZIP
                    </label>
                    <input
                      value={form.zip}
                      onChange={(e) =>
                        setForm({ ...form, zip: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  {
                    icon: <User className="w-4 h-4" />,
                    label: "Full Name",
                    value: user.name,
                  },
                  {
                    icon: <Mail className="w-4 h-4" />,
                    label: "Email",
                    value: user.email,
                  },
                  {
                    icon: <Phone className="w-4 h-4" />,
                    label: "Phone",
                    value: user.phone || "Not set",
                  },
                  {
                    icon: <MapPin className="w-4 h-4" />,
                    label: "Address",
                    value: user.address?.street
                      ? `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zip}`
                      : "Not set",
                  },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="flex items-start gap-3 py-3 border-b border-stone-50 dark:border-zinc-800/60 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center text-brand-500 flex-shrink-0 mt-0.5">
                      {field.icon}
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 dark:text-zinc-500 mb-0.5">
                        {field.label}
                      </p>
                      <p
                        className={`text-sm font-medium ${field.value === "Not set" ? "text-stone-400 dark:text-zinc-600 italic" : "text-stone-900 dark:text-white"}`}
                      >
                        {field.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent orders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-bold text-stone-900 dark:text-white">
                Recent Orders
              </h3>
              <Link
                href="/orders"
                className="text-sm text-brand-500 hover:text-brand-600 font-medium"
              >
                View all →
              </Link>
            </div>

            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 skeleton rounded-xl" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-10 h-10 text-stone-200 dark:text-zinc-700 mx-auto mb-3" />
                <p className="text-stone-500 dark:text-zinc-400 text-sm">
                  No orders yet
                </p>
                <Link
                  href="/"
                  className="text-sm text-brand-500 hover:text-brand-600 font-medium mt-2 inline-block"
                >
                  Start shopping →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 4).map((order) => (
                  <Link
                    key={order._id}
                    href={`/orders/${order._id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors group"
                  >
                    {/* Thumbnails */}
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 2).map((item, i) => (
                        <div
                          key={i}
                          className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-white dark:border-zinc-900 bg-stone-100 dark:bg-zinc-800"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-stone-400 dark:text-zinc-500">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm font-medium text-stone-900 dark:text-white mt-0.5 truncate">
                        {order.items[0].name}
                        {order.items.length > 1
                          ? ` +${order.items.length - 1}`
                          : ""}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-stone-900 dark:text-white text-sm">
                        ${order.total.toFixed(2)}
                      </p>
                      <span
                        className={`badge text-xs ${statusColors[order.status]} mt-1`}
                      >
                        {statusLabels[order.status] ||
                          order.status.replace("_", " ")}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-300 dark:text-zinc-600 group-hover:text-brand-500 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
