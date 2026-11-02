import { screen } from '@testing-library/react'
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

describe('Trace a batch', () => {
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

  it('traces a batch from a typed code, ignoring case, and shows its dated journey', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Traceability />)
    await screen.findByRole('button', { name: 'AUX-KAR-001' })

    await user.type(screen.getByLabelText('Batch code'), 'aux-kar-001')
    await user.click(screen.getByRole('button', { name: /Trace batch/ }))

    expect(await screen.findByText(/Journey of English Cucumber · Greenhouse 2/)).toBeInTheDocument()
    expect(screen.getByText('1 Aug 2026')).toBeInTheDocument()
    expect(screen.getByText('20 Oct 2026')).toBeInTheDocument()
    expect(screen.getByText('Now')).toBeInTheDocument()
    const lookup = holder.db.calls.find((c) => c.filters.batch_code)
    expect(lookup?.filters.batch_code).toBe('AUX-KAR-001')
  })

  it('opens straight to a batch from a ?code= link', async () => {
    renderWithProviders(<Traceability />, '/traceability?code=AUX-KAR-001')
    expect(await screen.findByText(/Journey of English Cucumber/)).toBeInTheDocument()
  })

  it('offers sample codes that run the lookup', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Traceability />)
    await screen.findByRole('button', { name: 'AUX-KAR-001' })
    await user.click(screen.getByRole('button', { name: 'AUX-SAM-102' }))
    expect(await screen.findByText(/Journey of Chillies/)).toBeInTheDocument()
  })

  it('says so, with a contact link, when the code is not found', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Traceability />)
    await screen.findByRole('button', { name: 'AUX-KAR-001' })
    await user.type(screen.getByLabelText('Batch code'), 'NOPE-1')
    await user.click(screen.getByRole('button', { name: /Trace batch/ }))
    expect(await screen.findByText(/no batch with the code/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'contact us' })).toHaveAttribute('href', '/contact')
  })
})
