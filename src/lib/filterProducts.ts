import type { GrowingMethod, PackSize, Product } from '@/data/products'

export interface ProductFilters {
  query: string
  method: GrowingMethod | 'all'
  pack: PackSize | 'any'
}

// Lower-case, trim, and drop a trailing "s" so "cucumbers" finds "cucumber".
function normalise(word: string): string {
  const w = word.toLowerCase().trim()
  return w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w
}

export function matchesQuery(product: Product, query: string): boolean {
  const tokens = query.split(/\s+/).map(normalise).filter(Boolean)
  if (tokens.length === 0) return true
  const haystack = [product.name, product.slug, ...product.aliases].join(' ').toLowerCase()
  return tokens.every((t) => haystack.includes(t))
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter(
    (p) =>
      matchesQuery(p, filters.query) &&
      (filters.method === 'all' || p.method === filters.method) &&
      (filters.pack === 'any' || p.packs.includes(filters.pack)),
  )
}
