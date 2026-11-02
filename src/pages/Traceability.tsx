import CodeLookup from '@/components/CodeLookup'
import PageHeader from '@/components/PageHeader'
import { useBatches } from '@/hooks/useBatches'
import { useT } from '@/i18n'
import { isSupabaseConfigured } from '@/lib/supabase'
import { usePageMeta } from '@/lib/usePageMeta'

export default function Traceability() {
  const t = useT()
  usePageMeta({
    title: t('Trace a batch'),
    description: t('Enter the batch code on your crate to see the farm, block and every stage it passed through.'),
  })
  const { data } = useBatches()
  const sampleCodes = (data ?? []).slice(0, 3).map((b) => b.batch_code)

  return (
    <>
      <PageHeader eyebrow={t('Traceability')} title={t('Every crate has a record')}>
        {t('Each batch is coded at harvest with the farm, block and date. Enter the code printed on your crate to see where it was grown and every stage it passed through.')}
      </PageHeader>
      <section className="container-x max-w-3xl">
        {isSupabaseConfigured ? (
          <CodeLookup sampleCodes={sampleCodes} />
        ) : (
          <p className="card p-6 text-muted-foreground">The tracker is not connected to the database yet.</p>
        )}
      </section>
    </>
  )
}
