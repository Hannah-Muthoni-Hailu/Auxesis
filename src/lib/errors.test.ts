import { describe, expect, it } from 'vitest'
import { errorMessage } from './errors'

describe('friendly error messages', () => {
  it('explains row-level security refusals', () => {
    expect(
      errorMessage({ message: 'new row violates row-level security policy for table "production_batches"' }),
    ).toMatch(/not allowed/)
  })

  it('explains login and network problems', () => {
    expect(errorMessage({ message: 'Invalid login credentials' })).toBe('Wrong email or password.')
    expect(errorMessage(new TypeError('Failed to fetch'))).toMatch(/internet connection/)
  })

  it('falls back safely', () => {
    expect(errorMessage(null)).toBe('Something went wrong. Please try again.')
    expect(errorMessage({ message: 'Custom text' })).toBe('Custom text')
  })
})
