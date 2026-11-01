import { MessageCircle, Phone } from 'lucide-react'
import FaqList from '@/components/FaqList'
import { site, whatsappLink } from '@/config/site'
import { faqGroups } from '@/data/faq'
import { usePageMeta } from '@/lib/usePageMeta'

export default function Faq() {
  usePageMeta({
    title: 'FAQ',
    description:
      'Answers for buyers and farmers: where our produce comes from, growing method, delivery beyond Nairobi, offtake, and payment terms.',
  })

  return (
    <section className="container-page py-14">
      <p className="eyebrow">Questions &amp; answers</p>
      <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Frequently asked questions</h1>
      <p className="mt-4 max-w-3xl text-bark-soft">
        Quick answers for buyers and for farmers. If yours is not here, call or message us.
      </p>

      <div className="mt-10 space-y-12">
        {faqGroups.map((group) => (
          <div key={group.id} id={group.id} className="max-w-3xl scroll-mt-24">
            <h2 className="text-2xl font-bold">{group.title}</h2>
            <p className="mb-4 mt-1 text-sm text-bark-soft">{group.intro}</p>
            <FaqList items={group.items} />
          </div>
        ))}
      </div>

      <div className="card mt-12 max-w-3xl p-6">
        <h2 className="text-lg font-semibold">Still have a question?</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappLink('Hello Auxesis, I have a question.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
          <a href={`tel:+${site.whatsappNumber}`} className="btn btn-secondary">
            <Phone size={18} /> Call {site.phone}
          </a>
        </div>
      </div>
    </section>
  )
}
