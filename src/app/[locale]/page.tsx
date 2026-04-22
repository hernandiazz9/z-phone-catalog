import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LocaleSwitcher } from '@/components/locale-switcher'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <LocaleSwitcher />
      </div>
      <p className="text-muted mt-2">{t('description')}</p>
    </main>
  )
}
