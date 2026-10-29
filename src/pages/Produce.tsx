import { ArrowRight, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import GalleryTile from '@/components/GalleryTile'
import ProductCard from '@/components/ProductCard'
import { products, type GrowingMethod, type PackSize } from '@/data/products'
import { filterProducts } from '@/lib/filterProducts'

const methods: Array<GrowingMethod | 'all'> = ['all', 'Greenhouse grown', 'Open field']
const packs: Array<PackSize | 'any'> = ['any', '10kg', '20kg', '50kg', '100kg', 'tonnes']

const gallery = [
  { src: '/images/greenhouse/1.jpg', caption: 'Young capsicum seedlings on drip lines' },
  { src: '/images/greenhouse/2.jpg', caption: 'Greenhouse rows under agronomy monitoring' },
  { src: '/images/greenhouse/3.jpg', caption: 'Fruiting stage, before colour change' },
  { src: '/images/greenhouse/4.jpg', caption: 'Trellised beds ahead of colour grading' },
]

export default function Produce() {
  const [query, setQuery] = useState('')
  const [method, setMethod] = useState<GrowingMethod | 'all'>('all')
  const [pack, setPack] = useState<PackSize | 'any'>('any')

  const results = useMemo(
    () => filterProducts(products, { query, method, pack }),
    [query, method, pack],
  )
  const isFiltered = query.trim() !== '' || method !== 'all' || pack !== 'any'

  function clearFilters() {
    setQuery('')
    setMethod('all')
    setPack('any')
  }

  return (
    <>
      <section className="container-page pt-14">
        <p className="eyebrow">Wholesale &amp; retail</p>
        <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Our produce</h1>
        <p className="mt-4 max-w-3xl text-bark-soft">
          Nine focused lines, mostly grown in open field and greenhouse, supplied consistently to
          traders, grocers, hotels and households at Marikiti and City Park, from our Karatina farm
          and commercial growers across Kenya. Our pack sizes start from 10kg, 20kg, 50kg and
          100kg, up to full tonnage on order.
        </p>

        {/* Filters */}
        <div className="card mt-8 space-y-5 p-5">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-soft"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search produce, e.g. courgette, bell pepper, cucumber"
              aria-label="Search produce"
              className="w-full rounded-xl border border-line bg-cream py-3 pl-10 pr-10 text-sm outline-none focus:border-olive"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-bark-soft hover:text-bark"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Growing method">
            {methods.map((m) => (
              <button
                key={m}
                type="button"
                className="chip"
                data-active={method === m}
                onClick={() => setMethod(m)}
              >
                {m === 'all' ? 'All growing methods' : m}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Pack size">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-bark-soft">
              Pack size
            </span>
            {packs.map((p) => (
              <button
                key={p}
                type="button"
                className="chip"
                data-active={pack === p}
                onClick={() => setPack(p)}
              >
                {p === 'any' ? 'Any' : p}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-bark-soft" aria-live="polite">
          {results.length} of {products.length} lines
        </p>

        {results.length > 0 ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <ProductCard key={p.slug} product={p} showDetails />
            ))}
          </div>
        ) : (
          <div className="card mt-4 p-8 text-center">
            <p className="font-semibold">No produce matches those filters.</p>
            <p className="mt-1 text-sm text-bark-soft">
              Try a different word or pack size, or ask us. We can often source what is not listed.
            </p>
            {isFiltered && (
              <button type="button" onClick={clearFilters} className="btn btn-secondary mt-5">
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* Greenhouse gallery */}
      <section className="container-page py-16">
        <p className="eyebrow">Inside our greenhouses</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">Capsicum, from seedling to fruit</h2>
        <p className="mt-3 max-w-3xl text-bark-soft">
          Our red and yellow capsicum start as transplanted seedlings on drip lines and are
          trellised through fruiting. They are picked green for trade or held on the plant until
          they colour up.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((g) => (
            <GalleryTile key={g.src} src={g.src} caption={g.caption} />
          ))}
        </div>
      </section>

      {/* Quote call to action */}
      <section className="container-page pb-4">
        <div className="flex flex-col items-start justify-between gap-5 rounded-3xl bg-olive-dark p-8 text-white md:flex-row md:items-center md:p-10">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Need volume pricing?</h2>
            <p className="mt-2 max-w-xl text-white/85">
              Tell us your crop, quantity and delivery point and we will quote from the next
              available batch.
            </p>
          </div>
          <Link to="/contact" className="btn shrink-0 bg-sun text-bark hover:bg-sun-dark">
            Request a quote <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
