# LUXE — E-Commerce Platform

A full-featured e-commerce app built with the latest stable versions of **Next.js 15**, **React 19**, **Tailwind CSS 3.4**, and **MongoDB / Mongoose 8**.

## Dependency Versions

| Package | Version |
|---|---|
| next | ^15.2.3 |
| react + react-dom | ^19.1.0 |
| typescript | ^5.8.2 |
| tailwindcss | ^3.4.17 |
| mongoose | ^8.12.1 |
| bcryptjs | ^3.0.2 |
| jsonwebtoken | ^9.0.2 |
| next-themes | ^0.4.6 |
| lucide-react | ^0.483.0 |
| stripe | ^17.7.0 |
| @types/node | ^22.13.10 |
| @types/react | ^19.1.0 |
| eslint | ^9.22.0 |

## Key Upgrades Applied

- **Next.js 15**: Async `params` in route handlers and page components, Turbopack dev bundler (`next dev --turbopack`), updated `metadata` API
- **React 19**: New `Context.value` prop (no more `Context.Provider`), cleaner `useContext`, `useActionState`
- **TypeScript 5.8**: `moduleDetection: force`, `target: ES2017`
- **Mongoose 8**: Typed `Model<T>` generics, `maxPoolSize`, no deprecated connection options
- **ESLint 9**: Flat config (`eslint.config.mjs`) replacing `.eslintrc`
- **bcryptjs 3**: Updated API, better TypeScript types
- **Configs**: `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs` — all typed ESM

## Features

- 🛒 **Cart** — Slide-in drawer, localStorage persistence, quantity controls
- 🔐 **Auth** — JWT cookie sessions, bcrypt hashed passwords, register/login modal
- 📦 **Orders** — Full checkout flow, order history
- 🚚 **Tracking** — Animated 6-step timeline: Placed → Confirmed → Processing → Shipped → Out for Delivery → Delivered
- 💳 **Payment** — Demo form (add Stripe keys for real payments)
- 🌙 **Dark Mode** — Full light/dark theme toggle
- 👤 **Profile** — Edit info, address, view order history
- 🔍 **Search & Filter** — Full-text search, category filters, pagination
- 📱 **Responsive** — Mobile-first, works on all screen sizes

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your MONGODB_URI and JWT_SECRET

# 3. Start MongoDB
# Local:  mongod --dbpath ~/data/db
# Docker: docker run -d -p 27017:27017 mongo:latest
# Cloud:  use MongoDB Atlas connection string

# 4. Seed 16 sample products
npm run seed

# 5. Start dev server (with Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/           # login · register · me · logout
│   │   ├── products/       # list + [id]
│   │   ├── orders/         # CRUD + [id]
│   │   └── user/profile/   # update profile
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── orders/
│   │   ├── page.tsx        # order list
│   │   └── [id]/page.tsx   # order detail + timeline
│   ├── products/[id]/page.tsx
│   ├── profile/page.tsx
│   ├── layout.tsx          # root layout (server component)
│   └── page.tsx            # home (Suspense wrapper)
├── components/
│   ├── layout/Navbar.tsx
│   └── ui/
│       ├── ShopContent.tsx   # client component for home page
│       ├── ProductCard.tsx
│       ├── CartDrawer.tsx
│       ├── AuthModal.tsx
│       └── OrderTimeline.tsx
├── context/
│   ├── CartContext.tsx     # React 19 Context API
│   └── AuthContext.tsx
├── lib/
│   ├── db.ts               # Mongoose 8 singleton
│   └── auth.ts             # JWT utilities
├── models/
│   ├── User.ts
│   ├── Product.ts
│   └── Order.ts
├── middleware.ts
├── next.config.ts          # typed Next.js 15 config
├── tailwind.config.ts      # typed Tailwind config
├── postcss.config.mjs      # ESM PostCSS config
├── eslint.config.mjs       # ESLint 9 flat config
└── scripts/seed.js
```

## Environment Variables

```env
# Required
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars

# Optional — for real Stripe payments
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App URL (used for metadata)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
