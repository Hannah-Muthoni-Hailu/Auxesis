import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeDb, type FakeDb } from '@/test/fakeDb'
import { batchRow, farmA, farmB, renderWithProviders } from '@/test/render'
import Traceability from './Traceability'

const holder = vi.hoisted(() => ({ db: null as unknown as FakeDb }))
vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: { from: (table: string) => holder.db.from(table) },
}))

describe('Farm tracker (public)', () => {
  beforeEach(() => {
    holder.db = createFakeDb({
      production_batches: [
        batchRow({ id: '1', crop: 'English Cucumber', stage: 'ready_for_market', farm_id: 'fa', farms: farmA, quantity_kg: 1800 }),
        batchRow({ id: '2', crop: 'Chillies', batch_code: 'AUX-SAM-102', stage: 'harvesting', farm_id: 'fb', farms: farmB, quantity_kg: 350 }),
      ],
    })
  })

  it('shows totals from the database', async () => {
    renderWithProviders(<Traceability />)

    expect(await screen.findByText('English Cucumber', { selector: 'h3' })).toBeInTheDocument()
    expect(screen.getByText('2,150 kg')).toBeInTheDocument()
    expect(screen.getByText('Farms in production').previousElementSibling).toHaveTextContent('2')
    expect(screen.getByText('Batches ready for market').previousElementSibling).toHaveTextContent('1')
  })

  it('filters by crop', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Traceability />)
    await screen.findByText('English Cucumber', { selector: 'h3' })

    const cropFilters = screen.getByRole('group', { name: 'Crop' })
    await user.click(within(cropFilters).getByRole('button', { name: 'Chillies' }))

    expect(screen.queryByText('English Cucumber', { selector: 'h3' })).not.toBeInTheDocument()
    expect(screen.getByText('Chillies', { selector: 'h3' })).toBeInTheDocument()
  })

  it('shows an empty-state message when nothing matches', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Traceability />)
    await screen.findByText('English Cucumber', { selector: 'h3' })

    const stageFilters = screen.getByRole('group', { name: 'Stage' })
    await user.click(within(stageFilters).getByRole('button', { name: 'Dispatched' }))

    expect(screen.getByText(/no batches match those filters/i)).toBeInTheDocument()
  })
})
