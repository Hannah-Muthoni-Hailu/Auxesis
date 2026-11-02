import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BatchTrace from '@/components/BatchTrace'
import { useBatchByCode } from '@/hooks/useBatches'
import { useT } from '@/i18n'
import { normaliseCode } from '@/lib/batches'

// Trace one batch by the code on its crate.
export default function CodeLookup({ sampleCodes }: { sampleCodes: string[] }) {
  const t = useT()
  const [params, setParams] = useSearchParams()
  const code = normaliseCode(params.get('code') ?? '')
  const [text, setText] = useState(code)
  const trace = useBatchByCode(code)

  const go = (value: string) => {
    const next = normaliseCode(value)
    setText(next)
    setParams(next ? { code: next } : {}, { replace: true })
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    go(text)
  }

  return (
    <div className="card p-5 md:p-6">
      <h2 className="text-lg font-semibold">{t('Trace a batch')}</h2>
      <p className="mt-1 text-sm text-bark-soft">
        {t('Type the batch code printed on your crate to see the farm it came from and the dates it passed each stage.')}
      </p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row" role="search">
        <label htmlFor="batch-code" className="sr-only">
          {t('Batch code')}
        </label>
        <input
          id="batch-code"
          className="input font-mono uppercase sm:max-w-xs"
          placeholder={t('For example AUX-KAR-001')}
          autoComplete="off"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          <Search size={18} /> {t('Trace batch')}
        </button>
      </form>
      {sampleCodes.length > 0 && (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-bark-soft">
          {t('Try:')}
          {sampleCodes.map((c) => (
            <button
              key={c}
              type="button"
              className="rounded-md bg-cream-dark px-2 py-0.5 font-mono text-xs hover:bg-line"
              onClick={() => go(c)}
            >
              {c}
            </button>
          ))}
        </p>
      )}

      {code !== '' && (
        <div className="mt-6" aria-live="polite">
          {trace.isPending ? (
            <p className="text-sm text-bark-soft">{t('Looking up {code}…', { code })}</p>
          ) : trace.isError ? (
            <p className="text-sm text-red-700">{t('We could not look that up right now. Please try again.')}</p>
          ) : trace.data ? (
            <BatchTrace batch={trace.data} />
          ) : (
            <p className="rounded-lg bg-cream-dark px-4 py-3 text-sm">
              {t('We have no batch with the code')} <span className="font-mono font-semibold">{code}</span>.{' '}
              {t('Check the code on your crate, or')}{' '}
              <Link to="/contact" className="font-semibold text-olive-dark hover:underline">
                {t('contact us')}
              </Link>
              .
            </p>
          )}
        </div>
      )}
    </div>
  )
}

