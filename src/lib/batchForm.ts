import { z } from 'zod'
import { STAGES, stageIndex, type Batch, type BatchStage } from './batches.ts'

const isoDate = /^\d{4}-\d{2}-\d{2}$/
const optionalDate = z
  .string()
  .refine((v) => v === '' || isoDate.test(v), 'Enter a valid date')

// The form works with plain text values; toPayload() converts them for the database.
export const batchFormSchema = z
  .object({
    farm_id: z.string().min(1, 'Choose a farm'),
    crop: z.string().min(1, 'Choose a crop'),
    variety: z.string().trim().max(80, 'Keep this under 80 characters'),
    stage: z.enum(STAGES),
    planted_on: z.string().regex(isoDate, 'Enter the planting date'),
    expected_harvest: optionalDate,
    harvested_on: optionalDate,
    market_ready_on: optionalDate,
    quantity_kg: z
      .string()
      .trim()
      .regex(/^\d+$/, 'Enter the quantity in whole kilograms')
      .refine((v) => !/^\d+$/.test(v) || Number(v) <= 10_000_000, 'That quantity looks too large'),
    grade: z.string().trim().max(10, 'Keep this short, for example A or A/B'),
    notes: z.string().trim().max(500, 'Keep notes under 500 characters'),
  })
  .superRefine((v, ctx) => {
    const problem = (path: keyof typeof v, message: string) =>
      ctx.addIssue({ code: 'custom', path: [path], message })

    // ISO dates compare correctly as plain text.
    if (v.expected_harvest && v.planted_on && v.expected_harvest < v.planted_on)
      problem('expected_harvest', 'Expected harvest cannot be before planting')
    if (v.harvested_on && v.planted_on && v.harvested_on < v.planted_on)
      problem('harvested_on', 'Harvest date cannot be before planting')
    if (v.market_ready_on) {
      const earliest = v.harvested_on || v.planted_on
      if (earliest && v.market_ready_on < earliest)
        problem('market_ready_on', 'Market-ready date cannot be before harvest')
    }

    // Keep the record honest: later stages need their dates.
    const i = stageIndex(v.stage)
    if (i >= stageIndex('harvested') && !v.harvested_on)
      problem('harvested_on', 'Add the harvest date for this stage')
    if (i >= stageIndex('ready_for_market') && !v.market_ready_on)
      problem('market_ready_on', 'Add the market-ready date for this stage')
  })

export type BatchFormValues = z.infer<typeof batchFormSchema>

export interface BatchPayload {
  farm_id: string
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
}

const blankToNull = (v: string) => (v.trim() === '' ? null : v.trim())

export function toPayload(v: BatchFormValues): BatchPayload {
  return {
    farm_id: v.farm_id,
    crop: v.crop,
    variety: blankToNull(v.variety),
    stage: v.stage,
    planted_on: v.planted_on,
    expected_harvest: blankToNull(v.expected_harvest),
    harvested_on: blankToNull(v.harvested_on),
    market_ready_on: blankToNull(v.market_ready_on),
    quantity_kg: Number(v.quantity_kg),
    grade: blankToNull(v.grade),
    notes: blankToNull(v.notes),
  }
}

export function formValuesFromBatch(b: Batch): BatchFormValues {
  return {
    farm_id: b.farm_id,
    crop: b.crop,
    variety: b.variety ?? '',
    stage: b.stage,
    planted_on: b.planted_on,
    expected_harvest: b.expected_harvest ?? '',
    harvested_on: b.harvested_on ?? '',
    market_ready_on: b.market_ready_on ?? '',
    quantity_kg: String(b.quantity_kg),
    grade: b.grade ?? '',
    notes: b.notes ?? '',
  }
}
