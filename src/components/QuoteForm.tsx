import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Field from '@/components/Field'
import { site, whatsappLink } from '@/config/site'
import { useSubmitEnquiry } from '@/hooks/useEnquiries'
import {
  enquiryCropOptions,
  enquirySchema,
  enquiryWhatsAppText,
  toEnquiryPayload,
  type EnquiryFormValues,
  type EnquiryPayload,
} from '@/lib/enquiry'

interface Props {
  /** Pre-select a crop, for example when arriving from a produce card. */
  initialCrop?: string
}

export default function QuoteForm({ initialCrop }: Props) {
  const submit = useSubmitEnquiry()
  const [sent, setSent] = useState<EnquiryPayload | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      crop: initialCrop && enquiryCropOptions.includes(initialCrop) ? initialCrop : '',
      quantity: '',
      delivery_point: '',
      message: '',
      website: '',
    },
  })

  const onSubmit = handleSubmit((values) => {
    const payload = toEnquiryPayload(values)
    // A filled honeypot means a bot: pretend it worked and save nothing.
    if (values.website.trim() !== '') {
      setSent(payload)
      return
    }
    submit.mutate(payload, { onSuccess: () => setSent(payload) })
  })

  if (sent) {
    return (
      <div className="card p-6 md:p-8" role="status">
        <CheckCircle2 className="text-olive" size={36} aria-hidden />
        <h2 className="mt-3 text-2xl font-bold">Thank you, {sent.name.split(' ')[0]}</h2>
        <p className="mt-2 text-bark-soft">
          We have your request and will call or message you on {sent.phone}. Our stall is open{' '}
          {site.hours.split('.')[0].toLowerCase()}.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappLink(enquiryWhatsAppText(sent))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <MessageCircle size={18} /> Also send on WhatsApp
          </a>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              reset()
              submit.reset()
              setSent(null)
            }}
          >
            Send another request
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-5 md:p-6" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Your name" htmlFor="name" error={errors.name}>
          <input id="name" autoComplete="name" className="input" {...register('name')} />
        </Field>

        <Field label="Phone or WhatsApp" htmlFor="phone" error={errors.phone}>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className="input"
            {...register('phone')}
          />
        </Field>

        <Field label="Email (optional)" htmlFor="email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" className="input" {...register('email')} />
        </Field>

        <Field label="Produce" htmlFor="crop" error={errors.crop}>
          <select id="crop" className="input" {...register('crop')}>
            <option value="">Choose a crop…</option>
            {enquiryCropOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Quantity (optional)"
          htmlFor="quantity"
          error={errors.quantity}
          hint="For example 500kg a week, or 2 tonnes"
        >
          <input id="quantity" className="input" {...register('quantity')} />
        </Field>

        <Field
          label="Delivery point (optional)"
          htmlFor="delivery_point"
          error={errors.delivery_point}
          hint="Town, market or address"
        >
          <input id="delivery_point" className="input" {...register('delivery_point')} />
        </Field>
      </div>

      <Field label="Message (optional)" htmlFor="message" error={errors.message}>
        <textarea id="message" rows={4} className="input" {...register('message')} />
      </Field>

      {/* Honeypot: hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {submit.isError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          We could not send your request. Please try again, or message us on{' '}
          <a
            href={whatsappLink('Hello Auxesis, I would like a quote.')}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            WhatsApp
          </a>
          .
        </p>
      )}

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={submit.isPending}>
        {submit.isPending ? 'Sending…' : 'Request a quote'}
      </button>
    </form>
  )
}
