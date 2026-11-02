import { ArrowLeft, MessageCircle, Phone, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDeleteRegistration, useFarmerRegistrations } from '@/hooks/useFarmerRegistrations'
import { toInternationalPhone } from '@/lib/enquiry'
import { errorMessage } from '@/lib/errors'
import { usePageMeta } from '@/lib/usePageMeta'

function received(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function Registrations() {
  usePageMeta({ title: 'Farmer registrations', noindex: true })
  const query = useFarmerRegistrations()
  const remove = useDeleteRegistration()
  const items = query.data ?? []

  return (
    <section className="container-page py-10">
      <Link to="/portal" className="inline-flex items-center gap-1 text-sm font-semibold text-olive-dark hover:underline">
        <ArrowLeft size={16} /> My batches
      </Link>
      <p className="eyebrow mt-4">Auxesis staff</p>
      <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">Farmer registrations</h1>
      <p className="mt-1 text-sm text-bark-soft">
        Farmers who registered on the Work with us page. Newest first. Only Auxesis staff can see this page.
      </p>

      {remove.isError && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage(remove.error)}
        </p>
      )}

      <div className="mt-8">
        {query.isPending ? (
          <p className="text-sm text-bark-soft" aria-live="polite">
            Loading registrations…
          </p>
        ) : query.isError ? (
          <p className="text-sm text-red-700">We could not load the registrations. Please refresh.</p>
        ) : items.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="font-semibold">No registrations yet.</p>
            <p className="mt-1 text-sm text-bark-soft">Farmers who register on the website appear here.</p>
          </div>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {items.map((r) => {
              const intl = toInternationalPhone(r.phone)
              return (
                <li key={r.id} className="card space-y-3 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold leading-tight">{r.name}</h2>
                      <p className="text-sm text-bark-soft">{received(r.created_at)}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-olive/10 px-3 py-1 text-xs font-semibold text-olive-dark">
                      {r.county}
                    </span>
                  </div>

                  <dl className="space-y-1 text-sm">
                    <div className="flex gap-2">
                      <dt className="w-24 shrink-0 text-bark-soft">Phone</dt>
                      <dd>{r.phone}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-24 shrink-0 text-bark-soft">Crops</dt>
                      <dd>{r.crops}</dd>
                    </div>
                    {r.volume && (
                      <div className="flex gap-2">
                        <dt className="w-24 shrink-0 text-bark-soft">Volume</dt>
                        <dd>{r.volume}</dd>
                      </div>
                    )}
                  </dl>

                  {r.message && <p className="whitespace-pre-wrap text-sm">{r.message}</p>}

                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <a href={`tel:+${intl}`} className="btn btn-secondary">
                      <Phone size={16} /> Call
                    </a>
                    <a
                      href={`https://wa.me/${intl}?text=${encodeURIComponent(`Hello ${r.name}, this is Auxesis about your farm registration.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </a>
                    <button
                      type="button"
                      className="btn border border-red-300 text-red-700 hover:bg-red-50"
                      disabled={remove.isPending}
                      onClick={() => {
                        if (window.confirm(`Delete the registration from ${r.name}? This cannot be undone.`))
                          remove.mutate(r.id)
                      }}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
