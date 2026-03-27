'use client'

import { useState, useActionState } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

type Mode = 'login' | 'register'

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode]               = useState<Mode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName]               = useState('')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const { login, register }           = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (mode === 'login') {
      const res = await login(email, password)
      if (res.success) {
        toast.success('Welcome back!', { icon: '👋' })
        onClose()
      } else {
        toast.error(res.error || 'Login failed')
      }
    } else {
      if (name.trim().length < 2) { toast.error('Name must be at least 2 characters'); return }
      const res = await register(name.trim(), email, password)
      if (res.success) {
        toast.success('Account created! Welcome to LUXE 🎉')
        onClose()
      } else {
        toast.error(res.error || 'Registration failed')
      }
    }
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    setName(''); setEmail(''); setPassword('')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-md card shadow-2xl p-8 animate-bounce-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-stone-900 dark:text-white">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-stone-500 dark:text-zinc-400 mt-2 text-sm">
            {mode === 'login' ? 'Sign in to your LUXE account' : 'Join LUXE for premium shopping'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-field pl-11"
                required
                minLength={2}
                autoComplete="name"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-zinc-500 pointer-events-none" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field pl-11"
              required
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-zinc-500 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field pl-11 pr-11"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-zinc-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button type="submit" className="w-full btn-primary">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500 dark:text-zinc-400">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="text-brand-500 font-semibold hover:text-brand-600 transition-colors"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
