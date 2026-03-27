'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  stock: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: 'ADD_ITEM';       payload: CartItem }
  | { type: 'REMOVE_ITEM';    payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART';      payload: CartItem[] }

function calcTotals(state: CartState): CartState {
  const total     = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
  return { ...state, total, itemCount }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.productId === action.payload.productId)
      const newItems = existing
        ? state.items.map(i =>
            i.productId === action.payload.productId
              ? { ...i, quantity: Math.min(i.quantity + action.payload.quantity, i.stock) }
              : i
          )
        : [...state.items, action.payload]
      return calcTotals({ ...state, items: newItems })
    }
    case 'REMOVE_ITEM':
      return calcTotals({ ...state, items: state.items.filter(i => i.productId !== action.payload) })
    case 'UPDATE_QUANTITY':
      return calcTotals({
        ...state,
        items: state.items.map(i =>
          i.productId === action.payload.productId
            ? { ...i, quantity: Math.max(1, Math.min(action.payload.quantity, i.stock)) }
            : i
        ),
      })
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 }
    case 'LOAD_CART':
      return calcTotals({ ...state, items: action.payload })
    default:
      return state
  }
}

interface CartContextValue {
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, itemCount: 0 })

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart')
      if (saved) {
        const items: CartItem[] = JSON.parse(saved)
        if (Array.isArray(items)) dispatch({ type: 'LOAD_CART', payload: items })
      }
    } catch { /* ignore corrupt data */ }
  }, [])

  // Persist on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
    toast.success(`${item.name} added to cart!`, { icon: '🛒' })
  }

  const removeItem    = (productId: string) => dispatch({ type: 'REMOVE_ITEM', payload: productId })
  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  return (
    <CartContext value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
