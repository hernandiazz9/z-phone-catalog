'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ColorSelector } from '@/components/phone-detail/color-selector'
import { StorageSelector } from '@/components/phone-detail/storage-selector'
import type { ColorOption, Phone, StorageOption } from '@/services/phones.types'

type Props = {
  phone: Phone
  open: boolean
  onClose: () => void
  onConfirm: (payload: { color: ColorOption; storage: StorageOption }) => void
}

export function VariantPickerModal({ phone, open, onClose, onConfirm }: Props) {
  const t = useTranslations('phoneList')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [color, setColor] = useState<ColorOption | null>(null)
  const [storage, setStorage] = useState<StorageOption | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setColor(null)
      setStorage(null)
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  function handleConfirm() {
    if (!color || !storage) return
    onConfirm({ color, storage })
  }

  const canConfirm = color !== null && storage !== null

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      aria-modal="true"
      aria-labelledby="quick-pick-title"
      className="bg-background text-foreground m-auto w-full max-w-lg p-0 backdrop:bg-black/40"
    >
      <form method="dialog" className="tablet:p-8 flex flex-col gap-6 p-6">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-muted text-2xs tracking-brand uppercase">{phone.brand}</span>
            <h2 id="quick-pick-title" className="text-foreground text-lg uppercase">
              {phone.name}
            </h2>
            <p className="text-muted text-xs tracking-widest uppercase">
              {t('quickPickDescription', { name: phone.name })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('quickPickCloseAriaLabel')}
            className="text-muted hover:text-foreground focus-visible:outline-foreground -m-2 p-2 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </header>

        {phone.storageOptions.length > 0 ? (
          <StorageSelector
            options={phone.storageOptions}
            selected={storage}
            onSelect={setStorage}
          />
        ) : null}

        {phone.colorOptions.length > 0 ? (
          <ColorSelector options={phone.colorOptions} selected={color} onSelect={setColor} />
        ) : null}

        <div className="border-border border-t pt-6">
          <p
            className="text-foreground text-3xl font-bold tracking-tight uppercase"
            aria-live="polite"
          >
            {storage
              ? t('priceLabel', { price: storage.price })
              : t('fromPriceLabel', { price: phone.basePrice })}
          </p>
        </div>

        <div className="tablet:flex-row flex flex-col gap-3">
          <button
            type="button"
            onClick={onClose}
            className="border-foreground text-foreground hover:bg-foreground hover:text-primary-foreground focus-visible:outline-foreground h-12 border px-6 text-xs tracking-widest uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t('quickPickCancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="bg-foreground text-primary-foreground hover:bg-highlight focus-visible:outline-foreground disabled:bg-border disabled:text-muted tablet:flex-1 h-12 px-6 text-xs tracking-widest uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed"
          >
            {t('quickPickConfirm')}
          </button>
        </div>
      </form>
    </dialog>
  )
}
