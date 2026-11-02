import type { ReactNode } from 'react'

export default function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="container-x pt-16 pb-10">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">{title}</h1>
      {children && <div className="mt-4 max-w-2xl text-lg text-muted-foreground">{children}</div>}
    </section>
  )
}
