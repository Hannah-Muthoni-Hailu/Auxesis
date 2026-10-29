import { Clock, Mail, MapPin, MessageCircle, Phone, Sprout } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { site, whatsappLink } from '@/config/site'
import { usePageMeta } from '@/lib/usePageMeta'

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <div className="card flex gap-4 p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-olive/10 text-olive-dark">
        {icon}
      </span>
      <div className="min-w-0">
        <h2 className="text-base font-semibold">{title}</h2>
        <div className="mt-1 text-sm text-bark-soft">{children}</div>
      </div>
    </div>
  )
}

export default function Contact() {
  usePageMeta({ title: 'Contact', description: 'Call, WhatsApp or visit Auxesis at Wakulima (Marikiti) Market, Nairobi for wholesale orders, retail enquiries and farmer partnerships.' })
  const phoneHref = `tel:+${site.whatsappNumber}`
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.stall)}`

  return (
    <section className="container-page py-14">
      <p className="eyebrow">Get in touch</p>
      <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Buy from us, or grow with us</h1>
      <p className="mt-4 max-w-3xl text-bark-soft">
        Wholesale orders, retail enquiries and farmer partnerships. Talk to the {site.name} team.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={whatsappLink('Hello Auxesis, I would like to enquire about your produce.')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <MessageCircle size={18} /> Chat on WhatsApp
        </a>
        <a href={phoneHref} className="btn btn-secondary">
          <Phone size={18} /> Call {site.phone}
        </a>
        <Link to="/quote" className="btn btn-secondary">
          Request a quote
        </Link>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <InfoCard icon={<MapPin size={22} />} title="Market stall">
          <p>{site.stall}</p>
          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block font-semibold text-olive-dark hover:underline"
          >
            Open in Maps
          </a>
        </InfoCard>

        <InfoCard icon={<Sprout size={22} />} title="Our farm">
          <p>{site.farm}</p>
        </InfoCard>

        <InfoCard icon={<Phone size={22} />} title="Call or WhatsApp">
          <a href={phoneHref} className="hover:text-olive-dark hover:underline">
            {site.phone}
          </a>
        </InfoCard>

        <InfoCard icon={<Mail size={22} />} title="Email">
          <a href={`mailto:${site.email}`} className="break-all hover:text-olive-dark hover:underline">
            {site.email}
          </a>
        </InfoCard>

        <div className="md:col-span-2">
          <InfoCard icon={<Clock size={22} />} title="Trading hours">
            <p>{site.hours}</p>
          </InfoCard>
        </div>
      </div>
    </section>
  )
}
