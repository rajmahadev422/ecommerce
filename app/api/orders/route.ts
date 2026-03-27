import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Order from '@/models/Order'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req)
    if (!authUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await dbConnect()
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const orders = await Order.find({ userId: authUser.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return NextResponse.json({ orders })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req)
    if (!authUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await dbConnect()
    const body = await req.json()
    const { items, shippingAddress, subtotal, tax, shipping, total } = body

    if (!items?.length) return NextResponse.json({ message: 'No items in order' }, { status: 400 })

    // Estimate delivery: 5-7 days from now
    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 6)

    // Generate tracking number
    const trackingNumber = `LUXE${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`

    const order = await Order.create({
      userId: authUser.userId,
      items,
      subtotal,
      tax,
      shipping,
      total,
      status: 'confirmed',
      paymentStatus: 'paid',
      shippingAddress,
      trackingNumber,
      estimatedDelivery,
      statusHistory: [
        { status: 'pending', timestamp: new Date(Date.now() - 60000), note: 'Order received' },
        { status: 'confirmed', timestamp: new Date(), note: 'Payment confirmed' },
      ],
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
