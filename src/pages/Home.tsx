import { ArrowRight, Check, Sprout, Store, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'
import { site } from '@/config/site'
import { products } from '@/data/products'
import { usePageMeta } from '@/lib/usePageMeta'

const pillars = [
  {
    icon: Store,
    title: 'Wholesale & retail at Marikiti & City Park',
    text: 'Daily volumes for traders, grocers, hotels and institutions, plus retail crates for walk-in customers.',
  },
  {
    icon: Sprout,
    title: 'Commercial growers',
    text: 'We work with commercial growers across Kenya on agreed varieties, spray programmes and harvest windows.',
  },
  {
    icon: Truck,
    title: 'Collection & delivery',
    text: 'Aggregation from farm gate, cool handling and same-day movement into the market.',
  },
]

const sourcingPoints = [
  'Fair, agreed farm-gate prices',
  'Agronomy support and variety selection',
  'Batch records from planting to dispatch',
]

export default function Home() {
  usePageMeta({})
  return (
    <>
      {/* Hero. Add a photo at public/images/hero.jpg and it appears behind the text. */}
      <section
        className="relative isolate overflow-hidden bg-olive-dark text-white"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(40,30,12,0.55), rgba(40,30,12,0.75)), url('/images/hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container-page py-20 md:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sun">
            Karatina, Nyeri · {site.markets}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] md:text-6xl">
            Fresh produce you can trace back to the row it grew in.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/90 md:text-lg">
            Auxesis supplies cucumbers, red and yellow capsicum, chillies and butternuts, wholesale
            and retail at Marikiti and City Park, sourced from commercial growers across Kenya and
            grown on our own farm in Karatina.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/traceability" className="btn btn-primary">
              Track farm production <ArrowRight size={18} />
            </Link>
            <Link
              to="/produce"
              className="btn border border-white/60 text-white hover:bg-white/10"
            >
              See our produce
            </Link>
          </div>
        </div>
      </section>

      {/* Traceability teaser + stats */}
      <section className="container-page grid gap-8 py-14 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">Every crate carries a batch story</h2>
          <p className="mt-3 max-w-xl text-bark-soft">
            From planting to harvest, grading and market-ready, our live tracker shows exactly where
            each farm's crop is in the cycle, so buyers know what lands at Marikiti and when.
          </p>
          <Link to="/traceability" className="btn btn-primary mt-6">
            Open the tracker <ArrowRight size={18} />
          </Link>
        </div>
        <dl className="grid grid-cols-2 gap-4">
          <div className="card p-5">
            <dt className="order-2 mt-1 text-sm text-bark-soft">Core crops we specialise in</dt>
            <dd className="font-display text-4xl font-extrabold text-olive-dark">
              {products.length}
            </dd>
          </div>
          <div className="card p-5">
            <dt className="order-2 mt-1 text-sm text-bark-soft">Our own farm in Nyeri County</dt>
            <dd className="font-display text-3xl font-extrabold text-olive-dark">Karatina</dd>
          </div>
        </dl>
      </section>

      {/* Three pillars */}
      <section className="border-y border-line bg-cream-dark/60">
        <div className="container-page grid gap-6 py-12 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, text }) => (
            <div key={title} className="space-y-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-olive/10 text-olive-dark">
                <Icon size={22} />
              </span>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-bark-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Produce lines */}
      <section className="container-page py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">What we grow &amp; trade</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Our produce lines</h2>
          </div>
          <Link
            to="/produce"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-olive-dark hover:underline"
          >
            All produce details <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link key={p.slug} to="/produce" className="block transition-transform hover:-translate-y-0.5">
              <ProductCard product={p} />
            </Link>
          ))}
        </div>
      </section>

      {/* Sourcing */}
      <section className="bg-bark text-cream">
        <div className="container-page grid gap-8 py-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow !text-sun">Sourcing</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Grown by commercial growers we know by name
            </h2>
            <p className="mt-4 text-cream/80">
              Auxesis buys directly from commercial growers across Kenya. Each farm is registered on
              our platform with its county, farmer, crop and planting dates, so the produce arriving
              at Marikiti and City Park can always be traced back to its source.
            </p>
          </div>
          <div className="space-y-5">
            <ul className="space-y-3">
              {sourcingPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sun text-bark">
                    <Check size={15} strokeWidth={3} />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn bg-sun text-bark hover:bg-sun-dark">
              Partner with us <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
