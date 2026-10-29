// Types and pure helpers for production batches. No network code here.

export const STAGES = [
  'planted',
  'growing',
  'harvesting',
  'harvested',
  'grading_packing',
  'ready_for_market',
  'dispatched',
] as const

export type BatchStage = (typeof STAGES)[number]

export const stageLabels: Record<BatchStage, string> = {
  planted: 'Planted',
  growing: 'Growing',
  harvesting: 'Harvesting',
  harvested: 'Harvested',
  grading_packing: 'Grading & Packing',
  ready_for_market: 'Ready for Market',
  dispatched: 'Dispatched',
}

// Full class names so Tailwind can see them.
export const stageStyles: Record<BatchStage, string> = {
  planted: 'bg-stone-200 text-stone-800',
  growing: 'bg-lime-100 text-lime-900',
  harvesting: 'bg-amber-100 text-amber-900',
  harvested: 'bg-orange-100 text-orange-900',
  grading_packing: 'bg-sky-100 text-sky-900',
  ready_for_market: 'bg-green-200 text-green-900',
  dispatched: 'bg-slate-200 text-slate-700',
}

export interface Farm {
  id: string
  name: string
  county: string
  farmer: string | null
  is_own_farm: boolean
}

export interface Batch {
  id: string
  farm_id: string
  batch_code: string
  crop: string
  variety: string | null
  stage: BatchStage
  planted_on: string
  expected_harvest: string | null
  harvested_on: string | null
  market_ready_on: string | null
  quantity_kg: number
  grade: string | null
  notes: string | null
  created_at: string
  farms: Farm | null
}

export interface BatchFilters {
  crop: string | 'all'
  stage: BatchStage | 'any'
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// "2026-05-25" -> "25 May 2026". Parsed by hand so time zones can never shift the day.
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!match) return '—'
  const [, year, month, day] = match
  const monthName = MONTHS[Number(month) - 1]
  if (!monthName) return '—'
  return `${Number(day)} ${monthName} ${year}`
}

export function formatKg(kg: number): string {
  return `${kg.toLocaleString('en-US')} kg`
}

export function stageIndex(stage: BatchStage): number {
  return STAGES.indexOf(stage)
}

export function filterBatches(batches: Batch[], filters: BatchFilters): Batch[] {
  return batches.filter(
    (b) =>
      (filters.crop === 'all' || b.crop === filters.crop) &&
      (filters.stage === 'any' || b.stage === filters.stage),
  )
}

export interface BatchSummary {
  farms: number
  readyForMarket: number
  volumeKg: number
}

export function summarise(batches: Batch[]): BatchSummary {
  return {
    farms: new Set(batches.map((b) => b.farm_id)).size,
    readyForMarket: batches.filter((b) => b.stage === 'ready_for_market').length,
    volumeKg: batches.reduce((total, b) => total + b.quantity_kg, 0),
  }
}
