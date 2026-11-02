import { Link } from 'react-router-dom'
import { useT } from '@/i18n'
import { usePageMeta } from '@/lib/usePageMeta'

// Shown for any address that does not exist.
export default function NotFound() {
  const t = useT()
  usePageMeta({ title: t('Page not found'), noindex: true })
  return (
    <div className="container-page py-20">
      <h1 className="text-4xl font-bold">{t('Page not found')}</h1>
      <p className="mt-3 text-bark-soft">{t('The page you are looking for does not exist or has moved.')}</p>
      <Link to="/" className="btn btn-primary mt-6">
        {t('Back to the home page')}
      </Link>
    </div>
  )
}
