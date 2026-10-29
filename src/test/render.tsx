import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'

export function renderWithProviders(ui: ReactElement, route = '/') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

export const farmA = {
  id: 'fa',
  name: 'Sample Grower A',
  county: 'Kirinyaga',
  farmer: null,
  is_own_farm: false,
}
export const farmB = {
  id: 'fb',
  name: 'Sample Grower B',
  county: 'Nakuru',
  farmer: null,
  is_own_farm: false,
}

export function batchRow(over: Record<string, unknown> = {}) {
  return {
    id: 'b1',
    farm_id: 'fa',
    batch_code: 'AUX-SAM-100',
    crop: 'Zucchini',
    variety: null,
    stage: 'planted',
    planted_on: '2026-09-01',
    expected_harvest: '2026-11-01',
    harvested_on: null,
    market_ready_on: null,
    quantity_kg: 500,
    grade: 'A',
    notes: null,
    created_at: '2026-09-01T00:00:00Z',
    farms: farmA,
    ...over,
  }
}
