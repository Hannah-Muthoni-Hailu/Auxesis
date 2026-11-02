import PageHeader from '@/components/PageHeader'
import { stories } from '@/data/home'
import { usePageMeta } from '@/lib/usePageMeta'

export default function Stories() {
  usePageMeta({
    title: 'Stories from the field',
    description: 'Grower guides, market reports and farmer profiles from Auxesis Fresh Produce.',
  })
  return (
    <>
      <PageHeader eyebrow="Stories" title="Stories from the field" />
      <section className="container-x grid gap-4 md:grid-cols-3">
        {stories.map((s) => (
          <article key={s.title} className="rounded-2xl border bg-card p-6">
            <p className="eyebrow">{s.tag}</p>
            <h2 className="mt-2 text-xl font-semibold">{s.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{s.meta}</p>
          </article>
        ))}
      </section>
    </>
  )
}
