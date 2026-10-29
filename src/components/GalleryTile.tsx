import { useState } from 'react'

interface Props {
  src: string
  caption: string
}

// Shows a photo if one exists at `src`, otherwise a plain panel with the caption.
export default function GalleryTile({ src, caption }: Props) {
  const [hasPhoto, setHasPhoto] = useState(true)

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative aspect-[4/3] w-full bg-olive/15">
        {hasPhoto && (
          <img
            src={src}
            alt={caption}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setHasPhoto(false)}
          />
        )}
      </div>
      <figcaption className="px-4 py-3 text-sm text-bark-soft">{caption}</figcaption>
    </figure>
  )
}
