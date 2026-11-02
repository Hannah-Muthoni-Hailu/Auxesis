import PageHeader from '@/components/PageHeader'
import { stories } from '@/data/home'
import { useT } from '@/i18n'
import { usePageMeta } from '@/lib/usePageMeta'

export default function Stories() {
  const t = useT()
  usePageMeta({
    title: t('Stories from the field'),
    description: t('Grower guides, market reports and farmer profiles from Auxesis Fresh Produce.'),
  })
  return (
    <>
      <PageHeader eyebrow={t('Stories')} title={t('Stories from the field')} />
      <section className="container-x grid gap-4 md:grid-cols-3">
        {stories.map((s) => (
          <article key={s.title} className="rounded-2xl border bg-card p-6">
            <p className="eyebrow">{t(s.tag)}</p>
            <h2 className="mt-2 text-xl font-semibold">{t(s.title)}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{t(s.meta)}</p>
          </article>
        ))}
      </section>
    </>
  )
}
