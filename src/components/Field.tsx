import type { ReactNode } from 'react'
import type { FieldError } from 'react-hook-form'

// A labelled form field with an optional hint and an error message.
export default function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  error?: FieldError
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-bark-soft">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-red-700">
          {error.message}
        </p>
      )}
    </div>
  )
}
