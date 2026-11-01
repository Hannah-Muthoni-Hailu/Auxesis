import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { FaqItem } from '@/data/faq'

// Each question opens and closes on tap. Built on <details>, so it works without scripts
// and with a keyboard or screen reader.
export default function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.q} className="card group overflow-hidden">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <ChevronDown
              size={20}
              aria-hidden
              className="mt-0.5 shrink-0 text-olive-dark transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="space-y-3 px-5 pb-5 text-sm text-bark-soft">
            <p>{item.a}</p>
            {item.link && (
              <Link to={item.link.to} className="inline-block font-semibold text-olive-dark hover:underline">
                {item.link.label}
              </Link>
            )}
          </div>
        </details>
      ))}
    </div>
  )
}
