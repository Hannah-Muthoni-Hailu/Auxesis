import { ArrowRight, Inbox, Plus, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import BatchForm from '@/components/BatchForm'
import { useAdvanceBatch, useDeleteBatch } from '@/hooks/useBatchMutations'
import { useBatches } from '@/hooks/useBatches'
import { useFarms } from '@/hooks/useFarms'
import {
  advancePatch,
  formatDate,
  formatKg,
  nextStage,
  stageLabels,
  stageStyles,
  todayISO,
  type Batch,
} from '@/lib/batches'
import { errorMessage } from '@/lib/errors'
import { usePageMeta } from '@/lib/usePageMeta'

type Editing = { kind: 'new' } | { kind: 'edit'; batch: Batch } | null

export default function Portal() {
  usePageMeta({ title: 'My batches', noindex: true })
  const { user, isStaff, farmIds, signOut } = useAuth()
  const navigate = useNavigate()
  const batchesQuery = useBatches()
  const farmsQuery = useFarms()
  const advance = useAdvanceBatch()
  const remove = useDeleteBatch()
  const [editing, setEditing] = useState<Editing>(null)

  // Farmers see only their own farm's batches; staff see everything.
  const myBatches = useMemo(() => {
    const all = batchesQuery.data ?? []
    return isStaff ? all : all.filter((b) => farmIds.includes(b.farm_id))
  }, [batchesQuery.data, isStaff, farmIds])

  const myFarms = useMemo(() => {
    const all = farmsQuery.data ?? []
    return isStaff ? all : all.filter((f) => farmIds.includes(f.id))
  }, [farmsQuery.data, isStaff, farmIds])

  const hasNoFarm = !isStaff && farmIds.length === 0
  const loading = batchesQuery.isPending || farmsQuery.isPending
  const actionError = advance.isError ? advance.error : remove.isError ? remove.error : null

  return (
    <section className="container-page py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{isStaff ? 'Auxesis staff' : 'Farmer portal'}</p>
          <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">My batches</h1>
          <p className="mt-1 text-sm text-bark-soft">Signed in as {user?.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isStaff && (
            <>
              <Link to="/portal/enquiries" className="btn btn-secondary">
                <Inbox size={18} /> Quote enquiries
              </Link>
              <Link to="/portal/farms" className="btn btn-secondary">
                <Users size={18} /> Farms &amp; farmers
              </Link>
            </>
          )}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => void signOut().then(() => navigate('/'))}
          >
            Sign out
          </button>
        </div>
      </div>

      {hasNoFarm && (
        <div className="card mt-8 p-6">
          <p className="font-semibold">Your account is not linked to a farm yet.</p>
          <p className="mt-1 text-sm text-bark-soft">
            Please ask Auxesis to link your account to your farm.{' '}
            <Link to="/contact" className="font-semibold text-olive-dark hover:underline">
              Contact us
            </Link>
            .
          </p>
        </div>
      )}

      {!hasNoFarm && (
        <>
          {editing ? (
            <div className="mt-8">
              <BatchForm
                key={editing.kind === 'edit' ? editing.batch.id : 'new'}
                farms={myFarms}
                batch={editing.kind === 'edit' ? editing.batch : undefined}
                onDone={() => setEditing(null)}
              />
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary mt-8 w-full sm:w-auto"
              onClick={() => setEditing({ kind: 'new' })}
              disabled={myFarms.length === 0}
            >
              <Plus size={18} /> Add a new batch
            </button>
          )}

          {actionError != null && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              {errorMessage(actionError)}
            </p>
          )}

          <div className="mt-8">
            {loading ? (
              <p className="text-sm text-bark-soft" aria-live="polite">
                Loading your batches…
              </p>
            ) : batchesQuery.isError ? (
              <p className="text-sm text-red-700">We could not load your batches. Please refresh.</p>
            ) : myBatches.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="font-semibold">You have no batches yet.</p>
                <p className="mt-1 text-sm text-bark-soft">
                  Use “Add a new batch” when you plant a crop.
                </p>
              </div>
            ) : (
              <ul className="grid gap-4 lg:grid-cols-2">
                {myBatches.map((b) => {
                  const next = nextStage(b.stage)
                  return (
                    <li key={b.id} className="card space-y-3 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-semibold leading-tight">{b.crop}</h2>
                          <p className="text-sm text-bark-soft">
                            {b.farms?.name} · {b.batch_code}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${stageStyles[b.stage]}`}
                        >
                          {stageLabels[b.stage]}
                        </span>
                      </div>

                      <p className="text-sm text-bark-soft">
                        Planted {formatDate(b.planted_on)} · Expected harvest{' '}
                        {formatDate(b.expected_harvest)} · {formatKg(b.quantity_kg)}
                      </p>

                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        {next && (
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={advance.isPending}
                            onClick={() => {
                              const patch = advancePatch(b, todayISO())
                              if (patch) advance.mutate({ id: b.id, patch })
                            }}
                          >
                            Move to {stageLabels[next]} <ArrowRight size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setEditing({ kind: 'edit', batch: b })}
                        >
                          Edit details
                        </button>
                        {isStaff && (
                          <button
                            type="button"
                            className="btn border border-red-300 text-red-700 hover:bg-red-50"
                            disabled={remove.isPending}
                            onClick={() => {
                              if (window.confirm(`Delete batch ${b.batch_code}? This cannot be undone.`))
                                remove.mutate(b.id)
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  )
}
