import { getTranslations } from 'next-intl/server'
import { PhoneCard } from '@/components/phone-card'
import type { PhoneListItem } from '@/services/phones.types'
import { Slider } from './slider'

type Props = { items: PhoneListItem[] }

export async function SimilarPhones({ items }: Props) {
  const t = await getTranslations('phoneDetail')

  if (items.length === 0) return null

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-foreground text-sm tracking-widest uppercase">{t('similarItems')}</h2>
      <Slider ariaLabel={t('similarItems')}>
        {items.map((phone) => (
          <li key={phone.id} className="bg-background w-70 shrink-0 snap-start">
            <PhoneCard phone={phone} />
          </li>
        ))}
      </Slider>
    </section>
  )
}
