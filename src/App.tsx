import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout'
import NotFound from '@/components/NotFound'
import RequireAuth from '@/components/RequireAuth'
import Home from '@/pages/Home'

// Other pages load on demand, so visitors only download what they open.
// The sign-in system and database library are only fetched for the tracker and portal.
const Produce = lazy(() => import('@/pages/Produce'))
const Traceability = lazy(() => import('@/pages/Traceability'))
const Tracker = lazy(() => import('@/pages/Tracker'))
const Stories = lazy(() => import('@/pages/Stories'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const Quote = lazy(() => import('@/pages/Quote'))
const Faq = lazy(() => import('@/pages/Faq'))
const WorkWithUs = lazy(() => import('@/pages/WorkWithUs'))
const AuthShell = lazy(() => import('@/auth/AuthShell'))
const Auth = lazy(() => import('@/pages/Auth'))
const Portal = lazy(() => import('@/pages/portal/Portal'))
const Farms = lazy(() => import('@/pages/portal/Farms'))
const Enquiries = lazy(() => import('@/pages/portal/Enquiries'))
const Registrations = lazy(() => import('@/pages/portal/Registrations'))

function PageLoading() {
  return (
    <div className="container-page py-20 text-sm text-bark-soft" aria-live="polite">
      Loading…
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="produce" element={<Produce />} />
          <Route path="traceability" element={<Traceability />} />
          <Route path="tracker" element={<Tracker />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="quote" element={<Quote />} />
          <Route path="faq" element={<Faq />} />
          <Route path="stories" element={<Stories />} />
          <Route path="work-with-us" element={<WorkWithUs />} />

          {/* Sign-in and portal pages share one sign-in provider. */}
          <Route element={<AuthShell />}>
            <Route path="auth" element={<Auth />} />
            <Route
              path="portal"
              element={
                <RequireAuth>
                  <Portal />
                </RequireAuth>
              }
            />
            <Route
              path="portal/farms"
              element={
                <RequireAuth staffOnly>
                  <Farms />
                </RequireAuth>
              }
            />
            <Route
              path="portal/enquiries"
              element={
                <RequireAuth staffOnly>
                  <Enquiries />
                </RequireAuth>
              }
            />
            <Route
              path="portal/registrations"
              element={
                <RequireAuth staffOnly>
                  <Registrations />
                </RequireAuth>
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
