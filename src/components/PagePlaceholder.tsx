// Temporary stand-in used until each page is built in its own step.
export default function PagePlaceholder({ title }: { title: string }) {
  return (
    <div className="container-page py-20">
      <p className="eyebrow">Coming together</p>
      <h1 className="mt-2 text-4xl font-bold">{title}</h1>
    </div>
  )
}
