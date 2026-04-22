import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function PhoneNotFound() {
  const t = await getTranslations('phoneDetail')

  return (
    <main className="max-w-page tablet:px-6 desktop:px-10 wide:px-25 mx-auto flex w-full flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <h1 className="tracking-brand text-foreground text-2xl uppercase">{t('notFoundTitle')}</h1>
      <p className="text-muted max-w-md text-center text-sm">{t('notFoundBody')}</p>
      <Link
        href="/"
        className="tracking-label border-foreground text-foreground hover:bg-foreground hover:text-primary-foreground focus-visible:outline-foreground border px-6 py-3 text-xs uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {t('notFoundCta')}
      </Link>
    </main>
  )
}
