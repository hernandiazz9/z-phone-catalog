'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import type { ColorOption, Phone, StorageOption } from '@/services/phones.types'
import { AddToCartButton } from './add-to-cart-button'
import { ColorSelector } from './color-selector'
import { StorageSelector } from './storage-selector'

type Props = { phone: Phone }

export function PhoneDetail({ phone }: Props) {
  const t = useTranslations('phoneDetail')
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null)
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(null)

  const displayImage = selectedColor?.imageUrl ?? phone.colorOptions[0]?.imageUrl ?? ''
  const price = selectedStorage?.price ?? phone.basePrice
  const priceLabel = selectedStorage ? t('priceLabel', { price }) : t('fromPriceLabel', { price })

  return (
    <section className="desktop:grid desktop:grid-cols-2 desktop:gap-16 flex flex-col gap-10">
      <div className="bg-background relative aspect-square w-full">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={`${phone.brand} ${phone.name}`}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 50vw"
            className="object-contain"
          />
        ) : null}
      </div>

      <div className="desktop:py-4 flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="text-foreground text-xl uppercase">{phone.name}</h1>
          <p className="text-foreground text-base">{priceLabel}</p>
        </header>

        <StorageSelector
          options={phone.storageOptions}
          selected={selectedStorage}
          onSelect={setSelectedStorage}
        />

        <ColorSelector
          options={phone.colorOptions}
          selected={selectedColor}
          onSelect={setSelectedColor}
        />

        <AddToCartButton
          phone={{ id: phone.id, brand: phone.brand, name: phone.name }}
          color={selectedColor}
          storage={selectedStorage}
        />
      </div>
    </section>
  )
}
