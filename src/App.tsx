import { Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout'
import PagePlaceholder from '@/components/PagePlaceholder'
import Home from '@/pages/Home'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="produce" element={<PagePlaceholder title="Our produce" />} />
        <Route path="traceability" element={<PagePlaceholder title="Farm production tracker" />} />
        <Route path="about" element={<PagePlaceholder title="About Auxesis" />} />
        <Route path="contact" element={<PagePlaceholder title="Contact" />} />
        <Route path="auth" element={<PagePlaceholder title="Staff sign in" />} />
        <Route path="*" element={<PagePlaceholder title="Page not found" />} />
      </Route>
    </Routes>
  )
}
