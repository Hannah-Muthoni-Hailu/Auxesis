import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Field from '@/components/Field'
import { site, whatsappLink } from '@/config/site'
import { useSubmitRegistration } from '@/hooks/useFarmerRegistrations'
import {
  registrationSchema,
  registrationWhatsAppText,
  toRegistrationPayload,
  type RegistrationFormValues,
  type RegistrationPayload,
} from '@/lib/farmerRegistration'

export default function FarmerRegistrationForm() {
  const submit = useSubmitRegistration()
  const [sent, setSent] = useState<RegistrationPayload | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { name: '', phone: '', county: '', crops: '', volume: '', message: '', website: '' },
  })

  const onSubmit = handleSubmit((values) => {
    const payload = toRegistrationPayload(values)
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
          We have your details and will call or message you on {sent.phone} to talk about what you
          grow. Our stall is open {site.hours.split('.')[0].toLowerCase()}.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappLink(registrationWhatsAppText(sent))}
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
            Register another farm
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-5 md:p-6" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Your name" htmlFor="reg-name" error={errors.name}>
          <input id="reg-name" autoComplete="name" className="input" {...register('name')} />
        </Field>

        <Field label="Phone or WhatsApp" htmlFor="reg-phone" error={errors.phone}>
          <input
            id="reg-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className="input"
            {...register('phone')}
          />
        </Field>

        <Field label="County" htmlFor="reg-county" error={errors.county} hint="For example Kirinyaga">
          <input id="reg-county" className="input" {...register('county')} />
        </Field>

        <Field label="Crops you grow or want to grow" htmlFor="reg-crops" error={errors.crops}>
          <input id="reg-crops" className="input" {...register('crops')} />
        </Field>

        <Field
          label="Expected volume (optional)"
          htmlFor="reg-volume"
          error={errors.volume}
          hint="For example 500kg a week"
        >
          <input id="reg-volume" className="input" {...register('volume')} />
        </Field>
      </div>

      <Field label="Anything else? (optional)" htmlFor="reg-message" error={errors.message}>
        <textarea id="reg-message" rows={3} className="input" {...register('message')} />
      </Field>

      {/* Honeypot: hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="reg-website">Leave this empty</label>
        <input id="reg-website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {submit.isError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          We could not send your details. Please try again, or message us on{' '}
          <a
            href={whatsappLink('Hello Auxesis, I would like to grow for you.')}
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
        {submit.isPending ? 'Sending…' : 'Register my farm'}
      </button>
    </form>
  )
}
