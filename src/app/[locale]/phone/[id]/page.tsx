import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { BackLink } from '@/components/back-link'
import { PhoneDetail } from '@/components/phone-detail'
import { SimilarPhones } from '@/components/phone-detail/similar-phones'
import { SpecsTable } from '@/components/phone-detail/specs-table'
import { getPhoneById } from '@/services/phones.service'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const phone = await getPhoneById(id)
    if (!phone) return {}
    return { title: `${phone.brand} ${phone.name}` }
  } catch {
    return {}
  }
}

export default async function PhoneDetailPage({ params }: Props) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const phone = await getPhoneById(id)
  if (!phone) notFound()

  return (
    <main className="max-w-page tablet:px-6 desktop:px-10 wide:px-25 mx-auto flex w-full flex-1 flex-col gap-12 px-4 py-6">
      <BackLink />
      <PhoneDetail phone={phone} />
      <SpecsTable phone={phone} />
      <SimilarPhones items={phone.similarProducts} />
    </main>
  )
}
