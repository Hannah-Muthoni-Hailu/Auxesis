import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '@/data/products'

interface Props {
  product: Product
  showDetails?: boolean
}

export default function ProductCard({ product, showDetails = false }: Props) {
  // If no photo has been added for this crop, fall back to the coloured panel.
  const [hasPhoto, setHasPhoto] = useState(true)

  return (
    <article className="card overflow-hidden">
      <div className="relative h-36 w-full" style={{ backgroundColor: product.color }}>
        {hasPhoto && (
          <img
            src={`/images/produce/${product.slug}.jpg`}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setHasPhoto(false)}
          />
        )}
      </div>
      <div className="space-y-2 p-5">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-bark-soft">{product.blurb}</p>
        {showDetails && (
          <>
            <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-olive-dark">
              {product.method}
            </p>
            <p className="text-xs text-bark-soft">{product.packNote}</p>
            <Link
              to={`/quote?crop=${encodeURIComponent(product.name)}`}
              className="inline-block pt-1 text-sm font-semibold text-olive-dark hover:underline"
            >
              Request a quote
            </Link>
          </>
        )}
      </div>
    </article>
  )
}
