import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import enMessages from '../../../messages/en.json'
import { LocaleSwitcher } from '.'

const replaceMock = vi.fn()

vi.mock('next/navigation', () => ({
  useParams: () => ({}),
}))

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/',
}))

function renderSwitcher() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <LocaleSwitcher />
    </NextIntlClientProvider>,
  )
}

describe('locale-switcher', () => {
  it('marks the current locale as pressed', () => {
    renderSwitcher()
    const en = screen.getByRole('button', { name: /^en$/i })
    const es = screen.getByRole('button', { name: /^es$/i })
    expect(en).toHaveAttribute('aria-pressed', 'true')
    expect(es).toHaveAttribute('aria-pressed', 'false')
  })

  it('switches locale when the inactive option is clicked', async () => {
    const user = userEvent.setup()
    replaceMock.mockClear()
    renderSwitcher()
    await user.click(screen.getByRole('button', { name: /^es$/i }))
    expect(replaceMock).toHaveBeenCalledWith(expect.objectContaining({ pathname: '/' }), {
      locale: 'es',
    })
  })

  it('does nothing when clicking the already-active locale', async () => {
    const user = userEvent.setup()
    replaceMock.mockClear()
    renderSwitcher()
    await user.click(screen.getByRole('button', { name: /^en$/i }))
    expect(replaceMock).not.toHaveBeenCalled()
  })
})
