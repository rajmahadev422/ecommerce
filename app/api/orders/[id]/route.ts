import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Order from '@/models/Order'
import { getAuthUser } from '@/lib/auth'

// Next.js 15: second argument params is now a Promise
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authUser = getAuthUser(req)
    if (!authUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await dbConnect()
    const order = await Order.findOne({ _id: id, userId: authUser.userId }).lean()
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 })

    return NextResponse.json({ order })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authUser = getAuthUser(req)
    if (!authUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await dbConnect()
    const { status, note } = await req.json()

    const order = await Order.findOne({ _id: id, userId: authUser.userId })
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 })

    order.status = status
    order.statusHistory.push({ status, timestamp: new Date(), note })
    await order.save()

    return NextResponse.json({ order })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
