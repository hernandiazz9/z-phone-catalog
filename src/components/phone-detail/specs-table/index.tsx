import { getTranslations } from 'next-intl/server'
import type { Phone } from '@/services/phones.types'

type Props = { phone: Phone }

export async function SpecsTable({ phone }: Props) {
  const t = await getTranslations('phoneDetail')

  const rows: Array<{ key: string; label: string; value: string }> = [
    { key: 'brand', label: t('specs.brand'), value: phone.brand },
    { key: 'name', label: t('specs.name'), value: phone.name },
    { key: 'description', label: t('specs.description'), value: phone.description },
    { key: 'screen', label: t('specs.screen'), value: phone.specs.screen },
    { key: 'resolution', label: t('specs.resolution'), value: phone.specs.resolution },
    { key: 'processor', label: t('specs.processor'), value: phone.specs.processor },
    { key: 'mainCamera', label: t('specs.mainCamera'), value: phone.specs.mainCamera },
    { key: 'selfieCamera', label: t('specs.selfieCamera'), value: phone.specs.selfieCamera },
    { key: 'battery', label: t('specs.battery'), value: phone.specs.battery },
    { key: 'os', label: t('specs.os'), value: phone.specs.os },
    {
      key: 'screenRefreshRate',
      label: t('specs.screenRefreshRate'),
      value: phone.specs.screenRefreshRate,
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-foreground text-sm tracking-widest uppercase">{t('specifications')}</h2>
      <dl className="border-border border-t">
        {rows.map((row) => (
          <div
            key={row.key}
            className="border-border tablet:grid-cols-[minmax(0,180px)_1fr] tablet:gap-8 grid grid-cols-1 gap-2 border-b py-3.5"
          >
            <dt className="tracking-label text-muted text-2xs uppercase">{row.label}</dt>
            <dd className="text-foreground text-sm">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
