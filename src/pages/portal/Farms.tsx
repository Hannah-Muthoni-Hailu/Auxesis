import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, UserMinus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useFarmMembers, useFarms } from '@/hooks/useFarms'
import type { Farm } from '@/lib/batches'
import { errorMessage } from '@/lib/errors'
import { supabase } from '@/lib/supabase'
import { usePageMeta } from '@/lib/usePageMeta'

function AddFarmForm() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [county, setCounty] = useState('')
  const [farmer, setFarmer] = useState('')
  const [isOwn, setIsOwn] = useState(false)

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('farms').insert({
        name: name.trim(),
        county: county.trim(),
        farmer: farmer.trim() || null,
        is_own_farm: isOwn,
      })
      if (error) throw error
    },
    onSuccess: () => {
      setName('')
      setCounty('')
      setFarmer('')
      setIsOwn(false)
      return queryClient.invalidateQueries({ queryKey: ['farms'] })
    },
  })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (name.trim() && county.trim()) add.mutate()
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-5">
      <h2 className="text-lg font-bold">Add a farm</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="farm-name" className="mb-1 block text-sm font-medium">Farm name</label>
          <input id="farm-name" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="farm-county" className="mb-1 block text-sm font-medium">County</label>
          <input id="farm-county" className="input" value={county} onChange={(e) => setCounty(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="farm-farmer" className="mb-1 block text-sm font-medium">Farmer (optional)</label>
          <input id="farm-farmer" className="input" value={farmer} onChange={(e) => setFarmer(e.target.value)} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isOwn} onChange={(e) => setIsOwn(e.target.checked)} />
        This is Auxesis’s own farm
      </label>
      {add.isError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage(add.error)}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={add.isPending}>
        {add.isPending ? 'Adding…' : 'Add farm'}
      </button>
    </form>
  )
}

function FarmCard({ farm, members }: { farm: Farm; members: { user_id: string; email: string }[] }) {
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['farm-members'] })

  const link = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('link_farmer', { p_email: email, p_farm_id: farm.id })
      if (error) throw error
    },
    onSuccess: () => {
      setEmail('')
      return refresh()
    },
  })

  const unlink = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.rpc('unlink_farmer', { p_user_id: userId, p_farm_id: farm.id })
      if (error) throw error
    },
    onSuccess: refresh,
  })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (email.trim()) link.mutate()
  }

  return (
    <li className="card space-y-4 p-5">
      <div>
        <h3 className="text-lg font-semibold">
          {farm.name}
          {farm.is_own_farm && (
            <span className="ml-2 rounded-full bg-sun/20 px-2 py-0.5 text-xs font-semibold text-sun-dark">
              Our farm
            </span>
          )}
        </h3>
        <p className="text-sm text-bark-soft">
          {farm.county}
          {farm.farmer ? ` · ${farm.farmer}` : ''}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-bark-soft">
          Farmer accounts linked
        </p>
        {members.length === 0 ? (
          <p className="mt-1 text-sm text-bark-soft">None yet.</p>
        ) : (
          <ul className="mt-1 space-y-1">
            {members.map((m) => (
              <li key={m.user_id} className="flex items-center justify-between gap-3 text-sm">
                <span className="break-all">{m.email}</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-red-700 hover:underline"
                  disabled={unlink.isPending}
                  onClick={() => {
                    if (window.confirm(`Remove ${m.email} from ${farm.name}?`)) unlink.mutate(m.user_id)
                  }}
                >
                  <UserMinus size={14} /> Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          className="input"
          placeholder="Farmer’s sign-in email"
          aria-label={`Farmer email to link to ${farm.name}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary shrink-0" disabled={link.isPending}>
          {link.isPending ? 'Linking…' : 'Link farmer'}
        </button>
      </form>
      {(link.isError || unlink.isError) && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage(link.error ?? unlink.error)}
        </p>
      )}
    </li>
  )
}

export default function Farms() {
  usePageMeta({ title: 'Farms & farmers', noindex: true })
  const farmsQuery = useFarms()
  const membersQuery = useFarmMembers(true)

  const members = membersQuery.data ?? []

  return (
    <section className="container-page py-10">
      <Link to="/portal" className="inline-flex items-center gap-1.5 text-sm font-semibold text-olive-dark hover:underline">
        <ArrowLeft size={16} /> Back to batches
      </Link>
      <p className="eyebrow mt-4">Auxesis staff</p>
      <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">Farms &amp; farmers</h1>

      <div className="card mt-6 space-y-2 p-5 text-sm text-bark-soft">
        <p className="font-semibold text-bark">How to give a farmer access</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            In Supabase, open <strong>Authentication → Users → Add user</strong>. Enter the farmer’s
            email and a password, and tick <strong>Auto Confirm User</strong>.
          </li>
          <li>Come back here and type that same email under the farm, then press “Link farmer”.</li>
          <li>Give the farmer their email and password. They sign in from the “Sign in” link.</li>
        </ol>
      </div>

      <div className="mt-8">
        <AddFarmForm />
      </div>

      <div className="mt-8">
        {farmsQuery.isPending ? (
          <p className="text-sm text-bark-soft">Loading farms…</p>
        ) : farmsQuery.isError ? (
          <p className="text-sm text-red-700">We could not load the farms. Please refresh.</p>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {(farmsQuery.data ?? []).map((f) => (
              <FarmCard
                key={f.id}
                farm={f}
                members={members.filter((m) => m.farm_id === f.id)}
              />
            ))}
          </ul>
        )}
        {membersQuery.isError && (
          <p className="mt-4 text-sm text-red-700">
            We could not load the linked accounts: {errorMessage(membersQuery.error)}
          </p>
        )}
      </div>
    </section>
  )
}
