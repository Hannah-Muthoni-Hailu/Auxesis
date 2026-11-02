import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeDb, type FakeDb } from '@/test/fakeDb'
import { batchRow, farmA, farmB, renderWithProviders } from '@/test/render'
import Tracker from './Tracker'

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
    renderWithProviders(<Tracker />)

    expect(await screen.findByText('English Cucumber', { selector: 'h3' })).toBeInTheDocument()
    expect(screen.getByText('2,150 kg')).toBeInTheDocument()
    expect(screen.getByText('Farms in production').previousElementSibling).toHaveTextContent('2')
    expect(screen.getByText('Batches ready for market').previousElementSibling).toHaveTextContent('1')
  })

  it('filters by crop', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Tracker />)
    await screen.findByText('English Cucumber', { selector: 'h3' })

    const cropFilters = screen.getByRole('group', { name: 'Crop' })
    await user.click(within(cropFilters).getByRole('button', { name: 'Chillies' }))

    expect(screen.queryByText('English Cucumber', { selector: 'h3' })).not.toBeInTheDocument()
    expect(screen.getByText('Chillies', { selector: 'h3' })).toBeInTheDocument()
  })

  it('shows an empty-state message when nothing matches', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Tracker />)
    await screen.findByText('English Cucumber', { selector: 'h3' })

    const stageFilters = screen.getByRole('group', { name: 'Stage' })
    await user.click(within(stageFilters).getByRole('button', { name: /^Dispatched/ }))

    expect(screen.getByText(/no batches match those filters/i)).toBeInTheDocument()
  })
})

describe('Farm tracker: pipeline', () => {
  beforeEach(() => {
    holder.db = createFakeDb({
      production_batches: [
        batchRow({
          id: '1', batch_code: 'AUX-KAR-001', crop: 'English Cucumber', stage: 'harvesting',
          block: 'Greenhouse 2', farm_id: 'fa', farms: farmA,
          batch_events: [
            { id: 'e1', batch_id: '1', stage: 'planted', occurred_on: '2026-08-01' },
            { id: 'e2', batch_id: '1', stage: 'harvesting', occurred_on: '2026-10-20' },
          ],
        }),
        batchRow({ id: '2', batch_code: 'AUX-SAM-102', crop: 'Chillies', stage: 'planted', farm_id: 'fb', farms: farmB }),
      ],
    })
  })

  it('shows how many batches are at each stage and filters when a stage is tapped', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Tracker />)
    await screen.findByText('English Cucumber', { selector: 'h3' })

    const pipeline = screen.getByRole('group', { name: 'Stage' })
    expect(within(pipeline).getByRole('button', { name: 'Planted, 1 batch' })).toBeInTheDocument()
    expect(within(pipeline).getByRole('button', { name: 'Growing, 0 batches' })).toBeInTheDocument()

    await user.click(within(pipeline).getByRole('button', { name: 'Planted, 1 batch' }))
    expect(screen.queryByText('English Cucumber', { selector: 'h3' })).not.toBeInTheDocument()
    expect(screen.getByText('Chillies', { selector: 'h3' })).toBeInTheDocument()

    // Tapping the same stage again clears the filter.
    await user.click(within(pipeline).getByRole('button', { name: 'Planted, 1 batch' }))
    expect(screen.getByText('English Cucumber', { selector: 'h3' })).toBeInTheDocument()
  })

})
