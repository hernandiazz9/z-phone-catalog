import { getTranslations } from 'next-intl/server'

export async function SkipLink() {
  const t = await getTranslations('header')

  return (
    <a
      href="#main-content"
      className="bg-foreground text-primary-foreground focus-visible:outline-foreground sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:text-xs focus:tracking-widest focus:uppercase focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {t('skipToContent')}
    </a>
  )
}
