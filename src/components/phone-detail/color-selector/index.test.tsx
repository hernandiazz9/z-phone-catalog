import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import enMessages from '../../../../messages/en.json'
import { ColorSelector } from '.'

const options = [
  { name: 'Blue titanium', hexCode: '#5b6472', imageUrl: 'http://example.test/b.webp' },
  { name: 'Black titanium', hexCode: '#1c1c1c', imageUrl: 'http://example.test/k.webp' },
  { name: 'Gold titanium', hexCode: '#d6c19a', imageUrl: 'http://example.test/g.webp' },
]

function renderSelector(selected: (typeof options)[number] | null = null) {
  const onSelect = vi.fn()
  const utils = render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <ColorSelector options={options} selected={selected} onSelect={onSelect} />
    </NextIntlClientProvider>,
  )
  return { ...utils, onSelect }
}

describe('color-selector', () => {
  it('exposes one radio per color with its name as the accessible label', () => {
    renderSelector()
    expect(screen.getByRole('radio', { name: 'Blue titanium' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Black titanium' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Gold titanium' })).toBeInTheDocument()
  })

  it('calls onSelect with the clicked color', async () => {
    const user = userEvent.setup()
    const { onSelect } = renderSelector()
    await user.click(screen.getByRole('radio', { name: 'Gold titanium' }))
    expect(onSelect).toHaveBeenCalledWith(options[2])
  })

  it('moves the selection with ArrowRight/ArrowLeft', async () => {
    const user = userEvent.setup()
    const { onSelect } = renderSelector(options[1])
    screen.getByRole('radio', { name: 'Black titanium' }).focus()

    await user.keyboard('{ArrowRight}')
    expect(onSelect).toHaveBeenLastCalledWith(options[2])

    await user.keyboard('{ArrowLeft}')
    expect(onSelect).toHaveBeenLastCalledWith(options[1])
  })

  it('wraps around when moving past the last option', async () => {
    const user = userEvent.setup()
    const { onSelect } = renderSelector(options[2])
    screen.getByRole('radio', { name: 'Gold titanium' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(onSelect).toHaveBeenLastCalledWith(options[0])
  })

  it('announces the selected color name via an aria-live region', () => {
    renderSelector(options[0])
    expect(screen.getByText('Blue titanium')).toBeInTheDocument()
  })
})
