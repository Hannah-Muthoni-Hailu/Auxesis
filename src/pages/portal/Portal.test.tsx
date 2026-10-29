import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeDb, type FakeDb } from '@/test/fakeDb'
import { batchRow, farmA, farmB, renderWithProviders } from '@/test/render'
import Portal from './Portal'

const holder = vi.hoisted(() => ({
  db: null as unknown as FakeDb,
  auth: {} as Record<string, unknown>,
}))

vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: (table: string) => holder.db.from(table),
    rpc: (name: string, args: unknown) => holder.db.rpc(name, args),
  },
}))
vi.mock('@/auth/useAuth', () => ({ useAuth: () => holder.auth }))

const ownBatch = batchRow({ id: 'b1', crop: 'Zucchini', farm_id: 'fa', farms: farmA })
const otherBatch = batchRow({
  id: 'b2',
  crop: 'Chillies',
  batch_code: 'AUX-SAM-101',
  farm_id: 'fb',
  farms: farmB,
})

function signInAs(role: 'farmer' | 'staff' | 'unlinked') {
  holder.auth = {
    user: { email: `${role}@example.com` },
    isStaff: role === 'staff',
    farmIds: role === 'farmer' ? ['fa'] : [],
    signOut: vi.fn().mockResolvedValue(undefined),
  }
}

describe('Portal', () => {
  beforeEach(() => {
    holder.db = createFakeDb({ production_batches: [ownBatch, otherBatch], farms: [farmA, farmB] })
  })

  it('shows a farmer only their own farm’s batches, with no delete option', async () => {
    signInAs('farmer')
    renderWithProviders(<Portal />)

    expect(await screen.findByText('Zucchini')).toBeInTheDocument()
    expect(screen.queryByText('Chillies')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /farms & farmers/i })).not.toBeInTheDocument()
  })

  it('moves a batch to the next stage with one tap', async () => {
    signInAs('farmer')
    const user = userEvent.setup()
    renderWithProviders(<Portal />)

    await user.click(await screen.findByRole('button', { name: /Move to Growing/ }))

    await waitFor(() => {
      const update = holder.db.calls.find((c) => c.op === 'update')
      expect(update?.filters).toEqual({ id: 'b1' })
      expect(update?.payload).toEqual({ stage: 'growing' })
    })
  })

  it('fills in today’s harvest date when a batch reaches Harvested', async () => {
    signInAs('farmer')
    holder.db = createFakeDb({
      production_batches: [batchRow({ id: 'b1', stage: 'harvesting', farm_id: 'fa' })],
      farms: [farmA],
    })
    const user = userEvent.setup()
    renderWithProviders(<Portal />)

    await user.click(await screen.findByRole('button', { name: /Move to Harvested/ }))

    await waitFor(() => {
      const update = holder.db.calls.find((c) => c.op === 'update')
      expect(update?.payload).toMatchObject({ stage: 'harvested' })
      expect(update?.payload).toHaveProperty('harvested_on')
    })
  })

  it('tells a farmer when a change is refused', async () => {
    signInAs('farmer')
    holder.db = createFakeDb(
      { production_batches: [ownBatch], farms: [farmA] },
      { denyWrites: true },
    )
    const user = userEvent.setup()
    renderWithProviders(<Portal />)

    await user.click(await screen.findByRole('button', { name: /Move to Growing/ }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/not allowed/i)
  })

  it('lets a farmer add a batch from the portal', async () => {
    signInAs('farmer')
    const user = userEvent.setup()
    renderWithProviders(<Portal />)

    const addButton = await screen.findByRole('button', { name: /Add a new batch/ })
    await waitFor(() => expect(addButton).toBeEnabled())
    await user.click(addButton)
    await user.selectOptions(screen.getByLabelText('Crop'), 'Broccoli')
    await user.type(screen.getByLabelText('Expected quantity (kg)'), '120')
    await user.click(screen.getByRole('button', { name: 'Add batch' }))

    await waitFor(() => {
      const insert = holder.db.calls.find((c) => c.op === 'insert')
      expect(insert?.payload).toMatchObject({ farm_id: 'fa', crop: 'Broccoli', quantity_kg: 120 })
    })
  })

  it('shows staff every batch, plus delete and farm management', async () => {
    signInAs('staff')
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const user = userEvent.setup()
    renderWithProviders(<Portal />)

    expect(await screen.findByText('Zucchini')).toBeInTheDocument()
    expect(screen.getByText('Chillies')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /farms & farmers/i })).toBeInTheDocument()

    const deletes = screen.getAllByRole('button', { name: /delete/i })
    expect(deletes).toHaveLength(2)
    await user.click(deletes[0])

    await waitFor(() => expect(holder.db.calls.some((c) => c.op === 'delete')).toBe(true))
    confirm.mockRestore()
  })

  it('explains to a farmer who is not linked to a farm yet', async () => {
    signInAs('unlinked')
    renderWithProviders(<Portal />)

    expect(await screen.findByText(/not linked to a farm yet/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Add a new batch/ })).not.toBeInTheDocument()
    expect(screen.queryByText('Zucchini')).not.toBeInTheDocument()
  })
})
