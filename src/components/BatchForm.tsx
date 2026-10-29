import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Field from '@/components/Field'
import { cropNames } from '@/data/products'
import { useSaveBatch } from '@/hooks/useBatchMutations'
import {
  batchFormSchema,
  formValuesFromBatch,
  toPayload,
  type BatchFormValues,
} from '@/lib/batchForm'
import { STAGES, stageLabels, todayISO, type Batch, type Farm } from '@/lib/batches'
import { errorMessage } from '@/lib/errors'

interface Props {
  farms: Farm[]
  /** Pass a batch to edit it; leave out to add a new one. */
  batch?: Batch
  onDone: () => void
}

export default function BatchForm({ farms, batch, onDone }: Props) {
  const save = useSaveBatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BatchFormValues>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: batch
      ? formValuesFromBatch(batch)
      : {
          farm_id: farms.length === 1 ? farms[0].id : '',
          crop: '',
          variety: '',
          stage: 'planted',
          planted_on: todayISO(),
          expected_harvest: '',
          harvested_on: '',
          market_ready_on: '',
          quantity_kg: '',
          grade: '',
          notes: '',
        },
  })

  const onSubmit = handleSubmit((values) => {
    save.mutate({ id: batch?.id, payload: toPayload(values) }, { onSuccess: onDone })
  })

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-5 md:p-6" noValidate>
      <h2 className="text-xl font-bold">{batch ? `Edit ${batch.batch_code}` : 'Add a new batch'}</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {farms.length === 1 ? (
          <div>
            <span className="mb-1 block text-sm font-medium">Farm</span>
            <p className="input bg-cream-dark/60">
              {farms[0].name}, {farms[0].county}
            </p>
            <input type="hidden" {...register('farm_id')} />
          </div>
        ) : (
          <Field label="Farm" htmlFor="farm_id" error={errors.farm_id}>
            <select id="farm_id" className="input" {...register('farm_id')}>
              <option value="">Choose a farm…</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}, {f.county}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Crop" htmlFor="crop" error={errors.crop}>
          <select id="crop" className="input" {...register('crop')}>
            <option value="">Choose a crop…</option>
            {cropNames.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Variety (optional)" htmlFor="variety" error={errors.variety} hint="For example Ashley F1">
          <input id="variety" className="input" {...register('variety')} />
        </Field>

        <Field label="Stage" htmlFor="stage" error={errors.stage}>
          <select id="stage" className="input" {...register('stage')}>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {stageLabels[s]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Planted on" htmlFor="planted_on" error={errors.planted_on}>
          <input id="planted_on" type="date" className="input" {...register('planted_on')} />
        </Field>

        <Field label="Expected harvest" htmlFor="expected_harvest" error={errors.expected_harvest}>
          <input id="expected_harvest" type="date" className="input" {...register('expected_harvest')} />
        </Field>

        <Field label="Harvested on" htmlFor="harvested_on" error={errors.harvested_on} hint="Leave empty until harvested">
          <input id="harvested_on" type="date" className="input" {...register('harvested_on')} />
        </Field>

        <Field label="Market-ready on" htmlFor="market_ready_on" error={errors.market_ready_on} hint="Leave empty until ready">
          <input id="market_ready_on" type="date" className="input" {...register('market_ready_on')} />
        </Field>

        <Field label="Expected quantity (kg)" htmlFor="quantity_kg" error={errors.quantity_kg}>
          <input id="quantity_kg" inputMode="numeric" className="input" {...register('quantity_kg')} />
        </Field>

        <Field label="Grade (optional)" htmlFor="grade" error={errors.grade} hint="For example A or A/B">
          <input id="grade" className="input" {...register('grade')} />
        </Field>
      </div>

      <Field label="Notes (optional)" htmlFor="notes" error={errors.notes}>
        <textarea id="notes" rows={3} className="input" {...register('notes')} />
      </Field>

      {save.isError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage(save.error)}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn btn-primary" disabled={save.isPending}>
          {save.isPending ? 'Saving…' : batch ? 'Save changes' : 'Add batch'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  )
}
