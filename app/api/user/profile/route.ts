import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { getAuthUser } from '@/lib/auth'

export async function PUT(req: NextRequest) {
  try {
    const authUser = getAuthUser(req)
    if (!authUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await dbConnect()
    const { name, phone, address } = await req.json()

    const user = await User.findByIdAndUpdate(
      authUser.userId,
      { $set: { name, phone, address } },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
