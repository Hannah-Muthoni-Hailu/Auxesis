import { describe, expect, it } from 'vitest'
import {
  advancePatch,
  filterBatches,
  formatDate,
  formatKg,
  nextStage,
  stageIndex,
  STAGES,
  summarise,
  todayISO,
  type Batch,
  type BatchStage,
} from './batches'

function batch(code: string, farm: string, crop: string, stage: BatchStage, kg: number): Batch {
  return {
    id: code,
    farm_id: farm,
    batch_code: code,
    crop,
    variety: null,
    stage,
    planted_on: '2026-05-25',
    expected_harvest: null,
    harvested_on: null,
    market_ready_on: null,
    quantity_kg: kg,
    grade: 'A',
    notes: null,
    created_at: '',
    farms: null,
  }
}

const rows = [
  batch('A', 'f1', 'English Cucumber', 'ready_for_market', 1800),
  batch('B', 'f1', 'Red Capsicum', 'growing', 900),
  batch('C', 'f2', 'Local Cucumber', 'grading_packing', 2400),
  batch('D', 'f2', 'Chillies', 'harvesting', 350),
  batch('E', 'f4', 'Yellow Capsicum', 'planted', 750),
  batch('F', 'f3', 'Butternuts', 'ready_for_market', 5200),
  batch('G', 'f3', 'Local Cucumber', 'dispatched', 1600),
]

describe('tracker summary and filters', () => {
  it('summarises farms, ready batches and volume', () => {
    expect(summarise(rows)).toEqual({ farms: 4, readyForMarket: 2, volumeKg: 13000 })
    expect(summarise([])).toEqual({ farms: 0, readyForMarket: 0, volumeKg: 0 })
  })

  it('filters by crop and stage', () => {
    const codes = (crop: string, stage: BatchStage | 'any') =>
      filterBatches(rows, { crop, stage }).map((b) => b.batch_code)
    expect(codes('all', 'any')).toHaveLength(7)
    expect(codes('Local Cucumber', 'any')).toEqual(['C', 'G'])
    expect(codes('all', 'ready_for_market')).toEqual(['A', 'F'])
    expect(codes('Local Cucumber', 'dispatched')).toEqual(['G'])
    expect(codes('Zucchini', 'any')).toEqual([])
  })
})

describe('formatting', () => {
  it('formats dates without time-zone surprises', () => {
    expect(formatDate('2026-05-25')).toBe('25 May 2026')
    expect(formatDate('2026-09-06')).toBe('6 Sep 2026')
    expect(formatDate('2026-12-31T10:00:00Z')).toBe('31 Dec 2026')
    expect(formatDate(null)).toBe('—')
    expect(formatDate('hello')).toBe('—')
    expect(formatDate('2026-13-01')).toBe('—')
  })

  it('formats kilograms and today', () => {
    expect(formatKg(13000)).toBe('13,000 kg')
    expect(todayISO(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('moving a batch forward', () => {
  const none = { harvested_on: null, market_ready_on: null }

  it('goes to the next stage', () => {
    expect(advancePatch({ stage: 'planted', ...none }, '2026-10-29')).toEqual({ stage: 'growing' })
    expect(stageIndex('planted')).toBe(0)
    expect(stageIndex('dispatched')).toBe(STAGES.length - 1)
  })

  it('fills the harvest date the first time only', () => {
    expect(advancePatch({ stage: 'harvesting', ...none }, '2026-10-29')).toEqual({
      stage: 'harvested',
      harvested_on: '2026-10-29',
    })
    expect(
      advancePatch({ stage: 'harvesting', harvested_on: '2026-10-01', market_ready_on: null }, '2026-10-29'),
    ).toEqual({ stage: 'harvested' })
  })

  it('fills the market-ready date', () => {
    expect(
      advancePatch({ stage: 'grading_packing', harvested_on: '2026-10-01', market_ready_on: null }, '2026-10-29'),
    ).toEqual({ stage: 'ready_for_market', market_ready_on: '2026-10-29' })
  })

  it('stops at the last stage', () => {
    expect(advancePatch({ stage: 'dispatched', ...none }, '2026-10-29')).toBeNull()
    expect(nextStage('dispatched')).toBeNull()
  })
})

describe('stage counts and batch-code lookup helpers', () => {
  it('counts batches at each stage, including stages with none', async () => {
    const { countByStage, STAGES } = await import('./batches')
    const counts = countByStage([
      { stage: 'planted' },
      { stage: 'planted' },
      { stage: 'dispatched' },
    ] as never)
    expect(counts.planted).toBe(2)
    expect(counts.dispatched).toBe(1)
    expect(counts.growing).toBe(0)
    expect(Object.keys(counts)).toEqual([...STAGES])
  })

  it('ignores spaces and letter case in a typed code', async () => {
    const { normaliseCode } = await import('./batches')
    expect(normaliseCode('  aux-kar 001 ')).toBe('AUX-KAR001')
    expect(normaliseCode('aux-kar-001')).toBe('AUX-KAR-001')
  })

  it('builds a timeline: reached stages dated, current marked, future empty', async () => {
    const { buildTimeline } = await import('./batches')
    const steps = buildTimeline({ stage: 'harvesting' }, [
      { id: '1', batch_id: 'b', stage: 'planted', occurred_on: '2026-08-01' },
      { id: '2', batch_id: 'b', stage: 'harvesting', occurred_on: '2026-10-20' },
    ])
    expect(steps.map((s) => s.state)).toEqual([
      'done', 'done', 'current', 'upcoming', 'upcoming', 'upcoming', 'upcoming',
    ])
    expect(steps[0].date).toBe('2026-08-01')
    expect(steps[1].date).toBeNull() // reached, but no recorded date: shown without a guess
    expect(steps[2].date).toBe('2026-10-20')
    expect(steps[3].date).toBeNull()
  })

  it('copes with a batch that has no history', async () => {
    const { buildTimeline } = await import('./batches')
    expect(buildTimeline({ stage: 'planted' }, null)[0]).toMatchObject({ state: 'current', date: null })
  })
})
