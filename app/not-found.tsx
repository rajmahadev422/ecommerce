import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 page-enter">
      <div className="text-center">
        <p className="text-8xl font-display font-bold text-stone-200 dark:text-zinc-800">404</p>
        <h2 className="font-display text-3xl font-bold text-stone-900 dark:text-white mt-2">Page not found</h2>
        <p className="text-stone-500 dark:text-zinc-400 mt-3 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="btn-primary">Back to Shop</Link>
      </div>
    </div>
  )
}
