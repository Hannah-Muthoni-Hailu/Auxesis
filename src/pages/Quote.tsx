import { MessageCircle, Phone } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import QuoteForm from '@/components/QuoteForm'
import { site, whatsappLink } from '@/config/site'
import { useT } from '@/i18n'
import { usePageMeta } from '@/lib/usePageMeta'

export default function Quote() {
  const t = useT()
  usePageMeta({
    title: t('Request a quote'),
    description: t('Tell us the produce, quantity and delivery point you need and Auxesis will send a wholesale quote.'),
  })
  const [params] = useSearchParams()
  const crop = params.get('crop') ?? undefined

  return (
    <section className="container-page py-14">
      <p className="eyebrow">{t('Wholesale & bulk orders')}</p>
      <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">{t('Request a quote')}</h1>
      <p className="mt-4 max-w-3xl text-bark-soft">
        {t('Tell us what you need and we will come back with price, availability and delivery. Prices move with the market, so we quote each order.')}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <QuoteForm key={crop ?? 'none'} initialCrop={crop} />

        <aside className="space-y-4 self-start">
          <div className="card p-5">
            <h2 className="text-base font-semibold">{t('Prefer to talk?')}</h2>
            <p className="mt-1 text-sm text-bark-soft">{t('We reply fastest on WhatsApp.')}</p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={whatsappLink('Hello Auxesis, I would like a quote.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle size={18} /> {t('Chat on WhatsApp')}
              </a>
              <a href={`tel:+${site.whatsappNumber}`} className="btn btn-secondary">
                <Phone size={18} /> {t('Call {phone}', { phone: site.phone })}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
