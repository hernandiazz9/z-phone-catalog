import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { PhoneListItem } from '@/services/phones.types'

type PhoneCardProps = {
  phone: PhoneListItem
  priority?: boolean
}

const TEXT_TRANSITION = 'transition-colors duration-300 ease-out'
const TEXT_TO_WHITE = `${TEXT_TRANSITION} group-hover:text-primary-foreground group-focus-visible:text-primary-foreground`
const BRAND_TO_MUTED_INVERSE = `${TEXT_TRANSITION} group-hover:text-muted-inverse group-focus-visible:text-muted-inverse`

export function PhoneCard({ phone, priority = false }: PhoneCardProps) {
  const t = useTranslations('phoneList')

  return (
    <Link
      href={`/phone/${phone.id}`}
      className="group bg-background focus-visible:outline-foreground relative flex aspect-square flex-col gap-6 overflow-hidden p-4 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span
        aria-hidden="true"
        className="bg-foreground absolute inset-0 translate-y-full transition-transform duration-600 ease-in-out group-hover:translate-y-0 group-focus-visible:translate-y-0"
      />

      <div className="relative min-h-0 flex-1">
        <Image
          src={phone.imageUrl}
          alt={phone.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 25vw, 344px"
          className="object-contain"
          priority={priority}
        />
      </div>

      <div className="relative flex items-end gap-2 text-xs tracking-widest uppercase">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={`text-muted text-2xs tracking-brand truncate ${BRAND_TO_MUTED_INVERSE}`}>
            {phone.brand}
          </span>
          <span className={`text-foreground truncate ${TEXT_TO_WHITE}`}>{phone.name}</span>
        </div>
        <span className={`text-foreground shrink-0 ${TEXT_TO_WHITE}`}>
          {t('priceLabel', { price: phone.basePrice })}
        </span>
      </div>
    </Link>
  )
}
