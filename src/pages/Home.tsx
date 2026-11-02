import { Link } from 'react-router-dom'
import farm from '@/assets/karatina-farm.jpg'
import MarketBoard from '@/components/MarketBoard'
import { audiences, stories, whatWeDo } from '@/data/home'
import { defaultDescription } from '@/config/seo'
import { useT } from '@/i18n'
import { usePageMeta } from '@/lib/usePageMeta'

export default function Home() {
  const t = useT()
  usePageMeta({ description: t(defaultDescription) })
  return (
    <>
      <section className="container-x grid gap-10 pt-16 pb-12 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div>
          <p className="eyebrow">{t('Karatina, Nyeri · Marikiti, Nairobi')}</p>
          <h1 className="mt-4 text-5xl font-extrabold leading-[1.05] md:text-6xl">
            {t('We grow, buy and connect Kenyan fresh produce to market.')}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            {t('From our farm in Karatina and a network of contracted growers to Marikiti and beyond. Every crate carries a batch code you can trace back to the field it came from.')}
          </p>
        </div>
        <img src={farm} alt={t('Capsicum greenhouse at the Auxesis Karatina farm')} width={1280} height={960} className="aspect-[4/3] w-full rounded-2xl object-cover" />
      </section>

      <section className="container-x grid gap-4 md:grid-cols-2">
        {audiences.map((x) => (
          <Link key={x.title} to={x.to} className="group rounded-2xl border bg-card p-7 transition hover:border-primary">
            <p className="eyebrow">{t(x.tag)}</p>
            <h2 className="mt-2 text-2xl font-bold">{t(x.title)}</h2>
            <p className="mt-3 text-muted-foreground">{t(x.text)}</p>
            <p className="mt-5 font-medium text-olive-dark group-hover:underline">{t(x.cta)} →</p>
          </Link>
        ))}
      </section>

      <section className="container-x mt-24">
        <p className="eyebrow">{t('What we do')}</p>
        <div className="mt-6 grid gap-8 md:grid-cols-3">
          {whatWeDo.map((x) => (
            <div key={x.n} className="border-t-2 border-sun pt-5">
              <p className="font-display text-sun-dark">{x.n}</p>
              <h3 className="mt-2 text-2xl font-bold">{t(x.title)}</h3>
              <p className="mt-3 text-muted-foreground">{t(x.text)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x mt-24 rounded-2xl bg-cream-dark p-8 md:p-12">
        <p className="eyebrow">{t('Traceability')}</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">{t('Every crate has a record')}</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          {t('Each batch is coded at harvest with the farm, block and date. Buyers can look up any code to see where their produce was grown and how it reached market.')}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/traceability" className="rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:bg-olive-dark">{t('Trace a batch')}</Link>
          <Link to="/tracker" className="rounded-full border border-foreground px-5 py-2.5 font-medium">{t('Open the farm tracker')}</Link>
        </div>
      </section>

      <section className="container-x mt-24">
        <MarketBoard />
        <Link to="/tracker" className="mt-4 inline-block font-medium text-olive-dark hover:underline">{t('Full market board')} →</Link>
      </section>

      <section className="container-x mt-24">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">{t('Stories from the field')}</h2>
          <Link to="/stories" className="font-medium text-olive-dark hover:underline">{t('All stories')} →</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {stories.map((s) => (
            <Link key={s.title} to="/stories" className="rounded-2xl border bg-card p-6 hover:border-primary">
              <p className="eyebrow">{t(s.tag)}</p>
              <h3 className="mt-2 text-lg font-semibold">{t(s.title)}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{t(s.meta)}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
