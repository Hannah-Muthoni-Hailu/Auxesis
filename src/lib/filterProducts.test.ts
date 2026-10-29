import { describe, expect, it } from 'vitest'
import { products, type GrowingMethod, type PackSize } from '@/data/products'
import { filterProducts, type ProductFilters } from './filterProducts'

const base: ProductFilters = { query: '', method: 'all', pack: 'any' }
const names = (f: Partial<ProductFilters>) =>
  filterProducts(products, { ...base, ...f }).map((p) => p.name).sort()

describe('produce search and filters', () => {
  it('shows all nine lines with no filters', () => {
    expect(names({})).toHaveLength(9)
  })

  it.each([
    ['courgette', ['Zucchini']],
    ['bell pepper', ['Red Capsicum', 'Yellow Capsicum']],
    ['cucumber', ['English Cucumber', 'Local Cucumber']],
    ['cucumbers', ['English Cucumber', 'Local Cucumber']],
    ['chili', ['Chillies']],
    ['squash', ['Butternuts', 'Zucchini']],
    ['  BROCCOLI ', ['Broccoli']],
    ['mango', []],
  ])('search "%s"', (query, expected) => {
    expect(names({ query })).toEqual(expected)
  })

  it('filters by growing method', () => {
    const method: GrowingMethod = 'Greenhouse grown'
    expect(names({ method })).toEqual(['English Cucumber', 'Red Capsicum', 'Yellow Capsicum'])
  })

  it('filters by pack size', () => {
    const pack: PackSize = '100kg'
    expect(names({ pack })).toEqual(['Butternuts', 'English Cucumber'])
  })

  it('combines filters', () => {
    expect(names({ method: 'Open field', query: 'cucumber' })).toEqual(['Local Cucumber'])
  })
})
