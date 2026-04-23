import { NextResponse } from 'next/server'
import { getPhoneById } from '@/services/phones.service'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const phone = await getPhoneById(id)
  if (!phone) {
    return NextResponse.json({ error: 'not-found' }, { status: 404 })
  }
  return NextResponse.json(phone)
}
