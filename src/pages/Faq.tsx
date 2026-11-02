import { MessageCircle, Phone } from 'lucide-react'
import FaqList from '@/components/FaqList'
import { site, whatsappLink } from '@/config/site'
import { faqGroups } from '@/data/faq'
import { useT } from '@/i18n'
import { usePageMeta } from '@/lib/usePageMeta'

export default function Faq() {
  const t = useT()
  usePageMeta({
    title: t('FAQ'),
    description: t('Answers for buyers and farmers: where our produce comes from, growing method, delivery beyond Nairobi, offtake, and payment terms.'),
  })

  return (
    <section className="container-page py-14">
      <p className="eyebrow">{t('Questions & answers')}</p>
      <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">{t('Frequently asked questions')}</h1>
      <p className="mt-4 max-w-3xl text-bark-soft">
        {t('Quick answers for buyers and for farmers. If yours is not here, call or message us.')}
      </p>

      <div className="mt-10 space-y-12">
        {faqGroups.map((group) => (
          <div key={group.id} id={group.id} className="max-w-3xl scroll-mt-24">
            <h2 className="text-2xl font-bold">{t(group.title)}</h2>
            <p className="mb-4 mt-1 text-sm text-bark-soft">{t(group.intro)}</p>
            <FaqList items={group.items} />
          </div>
        ))}
      </div>

      <div className="card mt-12 max-w-3xl p-6">
        <h2 className="text-lg font-semibold">{t('Still have a question?')}</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappLink('Hello Auxesis, I have a question.')}
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
    </section>
  )
}
