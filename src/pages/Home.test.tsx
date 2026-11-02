import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import Home from './Home'

describe('Home page structure', () => {
  it('has the sections in order: hero, audiences, what we do, traceability, market board, stories', () => {
    renderWithProviders(<Home />)
    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual([
      'We grow, buy and connect Kenyan fresh produce to market.',
      'Source produce',
      'Sell your produce',
      'We grow',
      'We buy',
      'We connect',
      'Every crate has a record',
      'This week at Marikiti',
      'Stories from the field',
      'Growing grade-A capsicum in Central Kenya',
      'Fresh produce outlook for November',
      'Farmer profile: selling beyond the local broker',
    ])
  })

  it('sends buyers to the quote form and farmers to registration', () => {
    renderWithProviders(<Home />)
    expect(screen.getByRole('link', { name: /Request a supply quote/ })).toHaveAttribute('href', '/quote')
    expect(screen.getByRole('link', { name: /Register your farm/ })).toHaveAttribute('href', '/work-with-us#farmers')
  })

  it('does not invent prices on the market board', () => {
    renderWithProviders(<Home />)
    const board = screen.getByText('This week at Marikiti').parentElement!
    expect(within(board).getAllByText('—')).toHaveLength(5)
  })
})
