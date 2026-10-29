import { describe, expect, it } from 'vitest'
import { batchFormSchema, formValuesFromBatch, toPayload, type BatchFormValues } from './batchForm'
import type { Batch } from './batches'

const valid: BatchFormValues = {
  farm_id: 'f1',
  crop: 'Zucchini',
  variety: ' Black Beauty ',
  stage: 'growing',
  planted_on: '2026-09-01',
  expected_harvest: '2026-11-01',
  harvested_on: '',
  market_ready_on: '',
  quantity_kg: '500',
  grade: 'A',
  notes: '',
}

const fieldsWithProblems = (overrides: Partial<BatchFormValues>) => {
  const result = batchFormSchema.safeParse({ ...valid, ...overrides })
  return result.success ? [] : result.error.issues.map((i) => i.path.join('.'))
}

describe('batch form validation', () => {
  it('accepts a valid form and converts it for the database', () => {
    const parsed = batchFormSchema.parse(valid)
    expect(toPayload(parsed)).toEqual({
      farm_id: 'f1',
      crop: 'Zucchini',
      variety: 'Black Beauty',
      stage: 'growing',
      planted_on: '2026-09-01',
      expected_harvest: '2026-11-01',
      harvested_on: null,
      market_ready_on: null,
      quantity_kg: 500,
      grade: 'A',
      notes: null,
    })
  })

  it.each([
    ['missing farm', { farm_id: '' }, ['farm_id']],
    ['missing crop', { crop: '' }, ['crop']],
    ['decimal quantity', { quantity_kg: '12.5' }, ['quantity_kg']],
    ['text quantity (one message only)', { quantity_kg: 'lots' }, ['quantity_kg']],
    ['negative quantity', { quantity_kg: '-5' }, ['quantity_kg']],
    ['huge quantity', { quantity_kg: '99999999' }, ['quantity_kg']],
    ['no planting date', { planted_on: '' }, ['planted_on']],
    ['expected before planting', { expected_harvest: '2026-08-01' }, ['expected_harvest']],
    ['harvested stage needs a harvest date', { stage: 'harvested' as const }, ['harvested_on']],
    [
      'ready stage needs a market-ready date',
      { stage: 'ready_for_market' as const, harvested_on: '2026-10-01' },
      ['market_ready_on'],
    ],
    [
      'market-ready before harvest',
      { stage: 'ready_for_market' as const, harvested_on: '2026-10-05', market_ready_on: '2026-10-03' },
      ['market_ready_on'],
    ],
    ['date typed as text', { expected_harvest: 'tomorrow' }, ['expected_harvest']],
  ])('rejects: %s', (_label, overrides, expected) => {
    expect(fieldsWithProblems(overrides)).toEqual(expected)
  })

  it('accepts a complete ready-for-market batch', () => {
    expect(
      fieldsWithProblems({
        stage: 'ready_for_market',
        harvested_on: '2026-10-01',
        market_ready_on: '2026-10-03',
      }),
    ).toEqual([])
  })

  it('round-trips an existing batch through the edit form', () => {
    const row: Batch = {
      id: 'x',
      farm_id: 'f1',
      batch_code: 'C',
      crop: 'Zucchini',
      variety: null,
      stage: 'growing',
      planted_on: '2026-09-01',
      expected_harvest: null,
      harvested_on: null,
      market_ready_on: null,
      quantity_kg: 500,
      grade: null,
      notes: null,
      created_at: '',
      farms: null,
    }
    expect(toPayload(batchFormSchema.parse(formValuesFromBatch(row))).quantity_kg).toBe(500)
  })
})
