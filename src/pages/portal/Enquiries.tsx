import { ArrowLeft, MessageCircle, Phone, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDeleteEnquiry, useEnquiries } from '@/hooks/useEnquiries'
import { toInternationalPhone } from '@/lib/enquiry'
import { errorMessage } from '@/lib/errors'
import { usePageMeta } from '@/lib/usePageMeta'

function received(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function Enquiries() {
  usePageMeta({ title: 'Quote enquiries', noindex: true })
  const query = useEnquiries()
  const remove = useDeleteEnquiry()
  const items = query.data ?? []

  return (
    <section className="container-page py-10">
      <Link to="/portal" className="inline-flex items-center gap-1 text-sm font-semibold text-olive-dark hover:underline">
        <ArrowLeft size={16} /> My batches
      </Link>
      <p className="eyebrow mt-4">Auxesis staff</p>
      <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">Quote enquiries</h1>
      <p className="mt-1 text-sm text-bark-soft">Newest first. Only Auxesis staff can see this page.</p>

      {remove.isError && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage(remove.error)}
        </p>
      )}

      <div className="mt-8">
        {query.isPending ? (
          <p className="text-sm text-bark-soft" aria-live="polite">
            Loading enquiries…
          </p>
        ) : query.isError ? (
          <p className="text-sm text-red-700">We could not load the enquiries. Please refresh.</p>
        ) : items.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="font-semibold">No enquiries yet.</p>
            <p className="mt-1 text-sm text-bark-soft">New quote requests from the website appear here.</p>
          </div>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {items.map((e) => {
              const intl = toInternationalPhone(e.phone)
              return (
                <li key={e.id} className="card space-y-3 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold leading-tight">{e.name}</h2>
                      <p className="text-sm text-bark-soft">{received(e.created_at)}</p>
                    </div>
                    {e.crop && (
                      <span className="shrink-0 rounded-full bg-olive/10 px-3 py-1 text-xs font-semibold text-olive-dark">
                        {e.crop}
                      </span>
                    )}
                  </div>

                  <dl className="space-y-1 text-sm">
                    <div className="flex gap-2">
                      <dt className="w-24 shrink-0 text-bark-soft">Phone</dt>
                      <dd>{e.phone}</dd>
                    </div>
                    {e.email && (
                      <div className="flex gap-2">
                        <dt className="w-24 shrink-0 text-bark-soft">Email</dt>
                        <dd className="min-w-0 break-all">{e.email}</dd>
                      </div>
                    )}
                    {e.quantity && (
                      <div className="flex gap-2">
                        <dt className="w-24 shrink-0 text-bark-soft">Quantity</dt>
                        <dd>{e.quantity}</dd>
                      </div>
                    )}
                    {e.delivery_point && (
                      <div className="flex gap-2">
                        <dt className="w-24 shrink-0 text-bark-soft">Deliver to</dt>
                        <dd>{e.delivery_point}</dd>
                      </div>
                    )}
                  </dl>

                  {e.message && <p className="whitespace-pre-wrap text-sm">{e.message}</p>}

                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <a href={`tel:+${intl}`} className="btn btn-secondary">
                      <Phone size={16} /> Call
                    </a>
                    <a
                      href={`https://wa.me/${intl}?text=${encodeURIComponent(`Hello ${e.name}, this is Auxesis about your quote request.`)}`}
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
                        if (window.confirm(`Delete the enquiry from ${e.name}? This cannot be undone.`))
                          remove.mutate(e.id)
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
