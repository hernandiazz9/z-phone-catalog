import { getTranslations, setRequestLocale } from 'next-intl/server'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 md:px-8">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <p className="text-muted mt-2">{t('description')}</p>
    </main>
  )
}
