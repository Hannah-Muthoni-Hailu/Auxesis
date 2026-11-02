import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { normaliseCode } from '@/lib/batches'

// The crate label on the home page: type the code printed on a crate and go straight to its record.
export default function HeroTrace() {
  const navigate = useNavigate()
  const [text, setText] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const code = normaliseCode(text)
    navigate(code ? `/traceability?code=${encodeURIComponent(code)}` : '/traceability')
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className="relative rounded-md border-2 border-bark bg-cream p-6 text-bark shadow-[6px_6px_0_var(--color-bark)] lg:rotate-[1.5deg]"
    >
      <span
        aria-hidden
        className="absolute -top-3 left-6 h-6 w-16 rotate-[-4deg] rounded-sm bg-sun/90 ring-2 ring-bark"
      />
      <h2 className="font-display text-2xl font-extrabold">Trace your crate</h2>
      <p className="mt-1 text-sm text-bark-soft">
        Every crate carries a batch code. Type it to see the farm and the dates it passed each stage.
      </p>
      <label htmlFor="hero-code" className="sr-only">
        Batch code
      </label>
      <input
        id="hero-code"
        className="input mt-4 font-mono uppercase"
        placeholder="AUX-KAR-001"
        autoComplete="off"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="btn btn-primary mt-3 w-full">
        <Search size={18} /> Trace batch
      </button>
    </form>
  )
}
