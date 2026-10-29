import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { isSupabaseConfigured } from '@/lib/supabase'
import { usePageMeta } from '@/lib/usePageMeta'

export default function Auth() {
  usePageMeta({ title: 'Sign in', noindex: true })
  const { session, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/portal'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!loading && session) return <Navigate to={from} replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const problem = await signIn(email, password)
    setBusy(false)
    if (problem) setError(problem)
    else navigate(from, { replace: true })
  }

  return (
    <section className="container-page py-14">
      <div className="mx-auto max-w-md">
        <p className="eyebrow">Farmers &amp; Auxesis staff</p>
        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">Sign in</h1>
        <p className="mt-3 text-bark-soft">
          Update your batches as your crop moves from planting to market. Anyone can view the
          public tracker without signing in.
        </p>

        {!isSupabaseConfigured ? (
          <div className="card mt-6 p-5 text-sm">
            Sign-in is not connected yet. Add the Supabase details to the <code>.env</code> file
            and restart the site.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="card mt-6 space-y-4 p-6" noValidate>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        <p className="mt-5 text-sm text-bark-soft">
          Accounts are created by Auxesis. If you need access or forgot your password,{' '}
          <Link to="/contact" className="font-semibold text-olive-dark hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
