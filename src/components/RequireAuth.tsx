import type { ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'

interface Props {
  children: ReactNode
  /** Only Auxesis staff may open this page. */
  staffOnly?: boolean
}

export default function RequireAuth({ children, staffOnly = false }: Props) {
  const { session, loading, rolesLoading, isStaff } = useAuth()
  const location = useLocation()

  if (loading || rolesLoading) {
    return (
      <div className="container-page py-20 text-sm text-bark-soft" aria-live="polite">
        Checking your sign-in…
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  if (staffOnly && !isStaff) {
    return (
      <div className="container-page py-20">
        <h1 className="text-2xl font-bold">This page is for Auxesis staff</h1>
        <p className="mt-2 text-bark-soft">Your account does not have access to it.</p>
        <Link to="/portal" className="btn btn-primary mt-6">
          Back to my batches
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
