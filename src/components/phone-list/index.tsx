import { getTranslations } from 'next-intl/server'
import { listPhones } from '@/services/phones.service'
import { PhoneCard } from '../phone-card'

const PAGE_SIZE = 20

// Matches the first full row on the widest breakpoint (wide: 5 cols).
// Every card beyond this index stays lazy-loaded so the page isn't
// overwhelmed with eager fetches.
const PRIORITY_IMAGE_COUNT = 5

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
        <ul className="bg-border tablet:grid-cols-2 desktop:grid-cols-4 wide:grid-cols-5 grid grid-cols-1 gap-px">
          {phones.map((phone, index) => (
            <li key={phone.id} className="bg-background">
              <PhoneCard phone={phone} priority={index < PRIORITY_IMAGE_COUNT} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
