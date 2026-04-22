import { getTranslations } from 'next-intl/server'
import { listPhones } from '@/services/phones.service'
import { PhoneCard } from '../phone-card'

const PAGE_SIZE = 20

type PhoneListProps = {
  search?: string
}

export async function PhoneList({ search }: PhoneListProps) {
  const t = await getTranslations('phoneList')

  const phones = await listPhones({ search, limit: PAGE_SIZE })

  return (
    <section className="flex flex-col gap-6">
      <p className="text-muted text-2xs tracking-brand uppercase" aria-live="polite">
        {t('resultsCount', { count: phones.length })}
      </p>

      {phones.length === 0 ? (
        <p className="text-foreground py-12 text-center text-sm">
          {t('empty', { query: search ?? '' })}
        </p>
      ) : (
        <ul className="bg-border grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {phones.map((phone) => (
            <li key={phone.id} className="bg-background">
              <PhoneCard phone={phone} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
