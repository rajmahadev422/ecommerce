import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'

// Next.js 15: second argument params is now a Promise
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await dbConnect()
    const product = await Product.findById(id).lean()
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json({ product })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
