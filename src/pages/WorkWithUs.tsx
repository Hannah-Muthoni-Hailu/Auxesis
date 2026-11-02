import { useState, type FormEvent } from 'react'
import PageHeader from '@/components/PageHeader'
import { useSubmitEnquiry } from '@/hooks/useEnquiries'
import { useSubmitRegistration } from '@/hooks/useFarmerRegistrations'
import { useT } from '@/i18n'
import { enquirySchema, type EnquiryPayload } from '@/lib/enquiry'
import { registrationSchema, type RegistrationPayload } from '@/lib/farmerRegistration'
import { usePageMeta } from '@/lib/usePageMeta'

const THANKS = "Thanks — we'll be in touch on WhatsApp."

interface FormProps {
  id?: string
  eyebrow: string
  title: string
  text: string
  fields: [string, string, string]
  /** Returns an error message, or null and the save is started. */
  onSend: (values: [string, string, string], done: () => void, fail: () => void) => string | null
}

// One card with three plain fields and a Send button, as on the client's design.
function WorkForm({ id, eyebrow, title, text, fields, onSend }: FormProps) {
  const t = useT()
  const [values, setValues] = useState<[string, string, string]>(['', '', ''])
  const [website, setWebsite] = useState('') // Honeypot: real visitors never see this.
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const [problem, setProblem] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    // A filled honeypot means a bot: pretend it worked and save nothing.
    if (website.trim() !== '') {
      setStatus('sent')
      return
    }
    const trimmed = values.map((v) => v.trim()) as [string, string, string]
    const error = onSend(trimmed, () => setStatus('sent'), () => setStatus('failed'))
    setProblem(error)
    if (!error) setStatus('sending')
  }

  return (
    <form id={id} onSubmit={submit} className="scroll-mt-24 rounded-2xl border bg-card p-7" noValidate>
      <p className="eyebrow">{t(eyebrow)}</p>
      <h2 className="mt-2 text-2xl font-bold">{t(title)}</h2>
      <p className="mt-3 text-muted-foreground">{t(text)}</p>
      <div className="mt-5 space-y-3">
        {fields.map((label, i) => (
          <input
            key={label}
            required
            aria-label={t(label)}
            placeholder={t(label)}
            value={values[i]}
            onChange={(e) => {
              const next = [...values] as [string, string, string]
              next[i] = e.target.value
              setValues(next)
            }}
            className="w-full rounded-lg border bg-background px-4 py-2.5 outline-none focus:border-primary"
          />
        ))}
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${eyebrow}-website`}>{t('Leave this empty')}</label>
        <input id={`${eyebrow}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <button
        disabled={status === 'sending'}
        className="mt-5 rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:bg-olive-dark disabled:opacity-60"
      >
        {t('Send')}
      </button>
      <div role={status === 'failed' || problem ? 'alert' : 'status'}>
        {problem ? (
          <p className="mt-3 text-sm text-red-700">{t(problem)}</p>
        ) : status === 'sent' ? (
          <p className="mt-3 text-sm">{t(THANKS)}</p>
        ) : status === 'failed' ? (
          <p className="mt-3 text-sm text-red-700">{t('We could not send that. Please try again, or message us on WhatsApp.')}</p>
        ) : null}
      </div>
    </form>
  )
}

export default function WorkWithUs() {
  const t = useT()
  usePageMeta({
    title: t('Work with us'),
    description: t('Buyers source graded produce with batch records. Farmers sell with clear grades, clear fees and prompt payment.'),
  })
  const enquiry = useSubmitEnquiry()
  const registration = useSubmitRegistration()

  const sendBuyer: FormProps['onSend'] = ([business, crops, phone], done, fail) => {
    if (!business || !crops || !phone) return 'Please fill in all three fields.'
    const parsed = enquirySchema.shape.phone.safeParse(phone)
    if (!parsed.success) return parsed.error.issues[0].message
    const payload: EnquiryPayload = {
      name: business.slice(0, 120),
      phone,
      email: null,
      crop: null,
      quantity: null,
      delivery_point: null,
      message: `Crops & weekly volume: ${crops}`.slice(0, 2000),
    }
    enquiry.mutate(payload, { onSuccess: done, onError: fail })
    return null
  }

  // "County & crop" is one box on this design: the first part before a comma is read as the county.
  const sendFarmer: FormProps['onSend'] = ([name, countyAndCrop, phone], done, fail) => {
    if (!name || !countyAndCrop || !phone) return 'Please fill in all three fields.'
    const parsed = registrationSchema.shape.phone.safeParse(phone)
    if (!parsed.success) return parsed.error.issues[0].message
    const [first, ...rest] = countyAndCrop.split(',')
    const hasSplit = rest.length > 0 && first.trim() !== ''
    const payload: RegistrationPayload = {
      name: name.slice(0, 120),
      phone,
      county: (hasSplit ? first.trim() : 'See crops').slice(0, 80),
      crops: countyAndCrop.slice(0, 200),
      volume: null,
      message: null,
    }
    registration.mutate(payload, { onSuccess: done, onError: fail })
    return null
  }

  return (
    <>
      <PageHeader eyebrow={t('Work with us')} title={t('Buyers and farmers, one market link')} />
      <section className="container-x grid gap-6 md:grid-cols-2">
        <WorkForm
          eyebrow="For buyers"
          title="Request a supply quote"
          text="Hotels, supermarkets, exporters, processors and Marikiti traders. Steady volumes, graded to spec, with records for every batch."
          fields={['Business name', 'Crops & weekly volume', 'Phone or WhatsApp']}
          onSend={sendBuyer}
        />
        <WorkForm
          id="farmers"
          eyebrow="For farmers"
          title="Register your farm"
          text="We buy what we grow ourselves, and link you to buyers for everything else. Fees are charged only when a sale is completed."
          fields={['Your name', 'County & crop', 'Phone or WhatsApp']}
          onSend={sendFarmer}
        />
      </section>
    </>
  )
}
