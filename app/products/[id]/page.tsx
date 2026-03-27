"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
}

// Next.js 15: params is a Promise
export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wished, setWished] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProduct(d.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 skeleton rounded-xl"
                style={{ width: `${70 - i * 5}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-white">
          Product not found
        </h2>
        <button onClick={() => router.push("/")} className="btn-primary mt-4">
          Back to Shop
        </button>
      </div>
    );

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 page-enter">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-stone-500 dark:text-zinc-400 hover:text-brand-500 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 dark:bg-zinc-800">
            <Image
              src={
                product.images[selectedImage] ||
                `https://via.placeholder.com/600?text=${encodeURIComponent(product.name)}`
              }
              alt={product.name}
              fill
              className="object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 badge bg-red-500 text-white text-sm font-bold px-3 py-1">
                -{discount}% OFF
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-brand-500 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-90"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`View ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-brand-500 font-semibold uppercase tracking-wide mb-1">
              {product.brand}
            </p>
            <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-white leading-tight mb-3">
              {product.name}
            </h1>
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-stone-200 dark:text-zinc-700"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-stone-500 dark:text-zinc-400">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-stone-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-stone-400 dark:text-zinc-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-stone-600 dark:text-zinc-400 leading-relaxed">
            {product.description}
          </p>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${product.stock > 5 ? "bg-green-400" : product.stock > 0 ? "bg-amber-400" : "bg-red-400"}`}
            />
            <span
              className={`text-sm font-medium ${product.stock > 5 ? "text-green-600 dark:text-green-400" : product.stock > 0 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}
            >
              {product.stock > 5
                ? "In Stock"
                : product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of Stock"}
            </span>
          </div>

          {/* Qty + Add to cart */}
          {product.stock > 0 && (
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-zinc-800 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-stone-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() =>
                  addItem({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                    quantity,
                    stock: product.stock,
                  })
                }
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={() => setWished(!wished)}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${wished ? "border-red-300 bg-red-50 dark:bg-red-950/30 text-red-500" : "border-stone-200 dark:border-zinc-700 text-stone-400 hover:border-red-300 hover:text-red-400"}`}
              >
                <Heart className={`w-5 h-5 ${wished ? "fill-red-500" : ""}`} />
              </button>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-100 dark:border-zinc-800">
            {[
              {
                icon: <Truck className="w-5 h-5" />,
                label: "Free Shipping",
                sub: "Orders over $50",
              },
              {
                icon: <Shield className="w-5 h-5" />,
                label: "Secure Pay",
                sub: "SSL encrypted",
              },
              {
                icon: <RotateCcw className="w-5 h-5" />,
                label: "Easy Returns",
                sub: "30-day policy",
              },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-stone-50 dark:bg-zinc-800/50"
              >
                <span className="text-brand-500">{badge.icon}</span>
                <p className="text-xs font-semibold text-stone-900 dark:text-white">
                  {badge.label}
                </p>
                <p className="text-xs text-stone-400 dark:text-zinc-500">
                  {badge.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="badge bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
