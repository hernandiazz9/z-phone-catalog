import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CartView } from '@/components/cart'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cart' })
  return { title: t('metadataTitle') }
}

export default async function CartPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main className="max-w-page tablet:px-6 desktop:px-10 wide:px-25 mx-auto flex w-full flex-1 flex-col px-4 py-6">
      <CartView />
    </main>
  )
}
