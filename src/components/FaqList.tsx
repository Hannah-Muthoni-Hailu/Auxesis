import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { answerText, type FaqItem } from '@/data/faq'
import { useT } from '@/i18n'

// Each question opens and closes on tap. Built on <details>, so it works without scripts
// and with a keyboard or screen reader.
export default function FaqList({ items }: { items: FaqItem[] }) {
  const t = useT()
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.q} className="card group overflow-hidden">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
            <span>{t(item.q)}</span>
            <ChevronDown
              size={20}
              aria-hidden
              className="mt-0.5 shrink-0 text-olive-dark transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="space-y-3 px-5 pb-5 text-sm text-bark-soft">
            <p>{answerText(item, t)}</p>
            {item.link && (
              <Link to={item.link.to} className="inline-block font-semibold text-olive-dark hover:underline">
                {t(item.link.label)}
              </Link>
            )}
          </div>
        </details>
      ))}
    </div>
  )
}
