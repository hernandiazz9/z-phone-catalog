import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import enMessages from '../../../../messages/en.json'
import { StorageSelector } from '.'

const options = [
  { capacity: '256 GB', price: 1099 },
  { capacity: '512 GB', price: 1299 },
  { capacity: '1 TB', price: 1499 },
]

function renderSelector(selected: (typeof options)[number] | null = null) {
  const onSelect = vi.fn()
  const utils = render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <StorageSelector options={options} selected={selected} onSelect={onSelect} />
    </NextIntlClientProvider>,
  )
  return { ...utils, onSelect }
}

describe('storage-selector', () => {
  it('renders one radio per storage option labelled by its capacity', () => {
    renderSelector()
    expect(screen.getByRole('radio', { name: '256 GB' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '512 GB' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '1 TB' })).toBeInTheDocument()
  })

  it('calls onSelect with the clicked option', async () => {
    const user = userEvent.setup()
    const { onSelect } = renderSelector()
    await user.click(screen.getByRole('radio', { name: '512 GB' }))
    expect(onSelect).toHaveBeenCalledWith(options[1])
  })

  it('moves the selection with ArrowRight and wraps around', async () => {
    const user = userEvent.setup()
    const { onSelect } = renderSelector(options[2])
    screen.getByRole('radio', { name: '1 TB' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(onSelect).toHaveBeenLastCalledWith(options[0])
  })

  it('marks the selected option with aria-checked', () => {
    renderSelector(options[1])
    expect(screen.getByRole('radio', { name: '512 GB' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: '256 GB' })).toHaveAttribute('aria-checked', 'false')
  })
})
