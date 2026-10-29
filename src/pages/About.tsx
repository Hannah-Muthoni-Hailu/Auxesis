import { ArrowRight, Handshake, Sprout, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '@/config/site'

const sides = [
  {
    icon: Sprout,
    title: 'Karatina farm',
    text: 'Our own production base in Nyeri County: trial plots, staggered planting and reliable baseline volumes.',
  },
  {
    icon: Handshake,
    title: 'Farmer partnerships',
    text: 'Agreed varieties, planting calendars and farm-gate prices with growers across the country.',
  },
  {
    icon: Store,
    title: 'Marikiti & City Park trading',
    text: 'Daily wholesale and retail sales from our stalls at Wakulima (Marikiti) Market and City Park, Nairobi.',
  },
]

const goals = [
  {
    title: 'Consistent quality',
    text: 'Clear grading standards per crop so buyers get the same product every week.',
  },
  {
    title: 'Fair farmer income',
    text: 'Direct buying that removes unnecessary middlemen from the chain.',
  },
  {
    title: 'Less post-harvest loss',
    text: 'Planned harvest windows matched to real market demand.',
  },
]

export default function About() {
  return (
    <>
      <section className="container-page pt-14">
        <p className="eyebrow">Who we are</p>
        <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">
          {site.name} {site.tagline}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-bark-soft">
          We source, grow, grade and sell fresh vegetables in Kenya: cucumbers (local and English),
          red and yellow capsicum, chillies and butternuts, trading wholesale and retail at
          Marikiti and City Park, Nairobi.
        </p>
      </section>

      <section className="container-page py-14">
        <h2 className="text-2xl font-bold md:text-3xl">Two sides of the same supply chain</h2>
        <p className="mt-3 max-w-3xl text-bark-soft">
          We produce on our own farm in Karatina, Nyeri County, and we aggregate from commercial
          growers and agri investors across Kenya. Growing ourselves keeps us honest about
          agronomy, timelines and quality; sourcing widely keeps supply steady through the
          seasons.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {sides.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card space-y-3 p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-olive/10 text-olive-dark">
                <Icon size={22} />
              </span>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-bark-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-cream-dark/60">
        <div className="container-page grid gap-6 py-14 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Traceability is the product</h2>
            <p className="mt-3 text-bark-soft">
              Every batch we handle is registered against a farm, a crop and a set of dates:
              planted, expected harvest, harvested, graded, market-ready and dispatched. Buyers can
              follow that record publicly on our farm tracker, with no guesswork about where
              produce came from or how fresh it is.
            </p>
          </div>
          <div className="md:justify-self-end">
            <Link to="/traceability" className="btn btn-primary">
              See the farm tracker <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="text-2xl font-bold md:text-3xl">What we are working towards</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {goals.map((g) => (
            <div key={g.title} className="border-l-4 border-sun pl-4">
              <h3 className="text-lg font-semibold">{g.title}</h3>
              <p className="mt-1 text-sm text-bark-soft">{g.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
