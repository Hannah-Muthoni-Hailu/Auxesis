import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { faqGroups } from '@/data/faq'
import { renderWithProviders } from '@/test/render'
import Faq from './Faq'

describe('Faq page', () => {
  it('shows every question, grouped for buyers and farmers', () => {
    renderWithProviders(<Faq />)
    expect(screen.getByRole('heading', { name: 'Buying from us' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Growing for us' })).toBeInTheDocument()
    for (const item of faqGroups.flatMap((g) => g.items)) {
      expect(screen.getByText(item.q)).toBeInTheDocument()
    }
  })

  it('opens an answer when its question is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Faq />)
    const question = screen.getByText('What are your terms of payment?')
    const details = question.closest('details')!
    expect(details.open).toBe(false)

    await user.click(question)

    expect(details.open).toBe(true)
    expect(screen.getByText(/agreed in writing/i)).toBeVisible()
  })

  it('links answers to the pages they mention', () => {
    renderWithProviders(<Faq />)
    expect(screen.getAllByRole('link', { name: /Farm Tracker/ })[0]).toHaveAttribute('href', '/traceability')
    expect(screen.getByRole('link', { name: 'Partner with us' })).toHaveAttribute('href', '/contact')
  })
})
