import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Batch } from '@/lib/batches'
import { createFakeDb, type FakeDb } from '@/test/fakeDb'
import { batchRow, farmA, farmB, renderWithProviders } from '@/test/render'
import BatchForm from './BatchForm'

const holder = vi.hoisted(() => ({ db: null as unknown as FakeDb }))
vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: (table: string) => holder.db.from(table),
    rpc: (name: string, args: unknown) => holder.db.rpc(name, args),
  },
}))

const writes = () => holder.db.calls.filter((c) => c.op === 'insert' || c.op === 'update')

describe('BatchForm', () => {
  beforeEach(() => {
    holder.db = createFakeDb({})
  })

  it('shows what is missing and saves nothing when submitted empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<BatchForm farms={[farmA, farmB]} onDone={() => {}} />)

    await user.click(screen.getByRole('button', { name: 'Add batch' }))

    expect(await screen.findByText('Choose a farm')).toBeInTheDocument()
    expect(screen.getByText('Choose a crop')).toBeInTheDocument()
    expect(screen.getByText('Enter the quantity in whole kilograms')).toBeInTheDocument()
    expect(writes()).toHaveLength(0)
  })

  it('adds a batch to the farmer’s only farm, without sending a batch code', async () => {
    const user = userEvent.setup()
    const onDone = vi.fn()
    renderWithProviders(<BatchForm farms={[farmA]} onDone={onDone} />)

    await user.selectOptions(screen.getByLabelText('Crop'), 'Zucchini')
    await user.type(screen.getByLabelText('Expected quantity (kg)'), '500')
    await user.click(screen.getByRole('button', { name: 'Add batch' }))

    await waitFor(() => expect(onDone).toHaveBeenCalled())
    const [insert] = writes()
    expect(insert.table).toBe('production_batches')
    expect(insert.op).toBe('insert')
    expect(insert.payload).toMatchObject({
      farm_id: 'fa',
      crop: 'Zucchini',
      stage: 'planted',
      quantity_kg: 500,
    })
    expect(insert.payload).not.toHaveProperty('batch_code')
  })

  it('shows a friendly message when the database refuses', async () => {
    holder.db = createFakeDb(
      {},
      { insertError: 'new row violates row-level security policy for table "production_batches"' },
    )
    const user = userEvent.setup()
    renderWithProviders(<BatchForm farms={[farmA]} onDone={() => {}} />)

    await user.selectOptions(screen.getByLabelText('Crop'), 'Chillies')
    await user.type(screen.getByLabelText('Expected quantity (kg)'), '50')
    await user.click(screen.getByRole('button', { name: 'Add batch' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/not allowed/i)
  })

  it('edits an existing batch', async () => {
    const user = userEvent.setup()
    const onDone = vi.fn()
    const batch = batchRow({ id: 'b9', quantity_kg: 500 }) as unknown as Batch
    renderWithProviders(<BatchForm farms={[farmA]} batch={batch} onDone={onDone} />)

    const quantity = screen.getByLabelText('Expected quantity (kg)')
    await user.clear(quantity)
    await user.type(quantity, '750')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => expect(onDone).toHaveBeenCalled())
    const [update] = writes()
    expect(update.op).toBe('update')
    expect(update.filters).toEqual({ id: 'b9' })
    expect(update.payload).toMatchObject({ quantity_kg: 750, crop: 'Zucchini' })
  })
})
