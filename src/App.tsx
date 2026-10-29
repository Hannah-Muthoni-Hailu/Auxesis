import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout'
import PagePlaceholder from '@/components/PagePlaceholder'
import Home from '@/pages/Home'

// Other pages load on demand, so visitors only download what they open
// (for example the database library is only fetched for the tracker).
const Produce = lazy(() => import('@/pages/Produce'))
const Traceability = lazy(() => import('@/pages/Traceability'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))

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
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="auth" element={<PagePlaceholder title="Staff sign in" />} />
          <Route path="*" element={<PagePlaceholder title="Page not found" />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
