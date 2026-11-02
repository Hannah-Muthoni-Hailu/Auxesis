import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Layout from '@/components/Layout'
import NotFound from '@/components/NotFound'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Faq from '@/pages/Faq'
import Home from '@/pages/Home'
import Produce from '@/pages/Produce'
import Quote from '@/pages/Quote'
import Stories from '@/pages/Stories'
import Traceability from '@/pages/Traceability'
import Tracker from '@/pages/Tracker'
import WorkWithUs from '@/pages/WorkWithUs'
import { createFakeDb, type FakeDb } from '@/test/fakeDb'
import { batchRow, farmA, renderWithProviders } from '@/test/render'
import { clearMissingTranslations, LangProvider, missingTranslations } from './index'

const holder = vi.hoisted(() => ({ db: null as unknown as FakeDb }))
vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: { from: (table: string) => holder.db.from(table) },
}))

const batch = batchRow({
  id: '1', batch_code: 'AUX-KAR-001', crop: 'English Cucumber', stage: 'harvesting', block: 'Greenhouse 2',
  grade: 'A', farms: { ...farmA, is_own_farm: true },
  batch_events: [{ id: 'e1', batch_id: '1', stage: 'planted', occurred_on: '2026-08-01' }],
})

function page(node: React.ReactElement, route = '/') {
  return renderWithProviders(
    <LangProvider initial="sw">
      <Routes>
        <Route element={<Layout />}>
          <Route path="*" element={node} />
        </Route>
      </Routes>
    </LangProvider>,
    route,
  )
}

describe('every public page has Swahili text', () => {
  beforeEach(() => {
    holder.db = createFakeDb({ production_batches: [batch] })
    clearMissingTranslations()
  })

  it('home, stories, about, contact, faq, produce, 404, work with us', async () => {
    for (const node of [<Home />, <Stories />, <About />, <Contact />, <Faq />, <Produce />, <NotFound />, <WorkWithUs />]) {
      const { unmount } = page(node)
      unmount()
    }
    expect(missingTranslations()).toEqual([])
  })

  it('tracker and batch lookup, including not found', async () => {
    const first = page(<Tracker />)
    await screen.findByText('AUX-KAR-001', { exact: false })
    first.unmount()
    const found = page(<Traceability />, '/traceability?code=AUX-KAR-001')
    await screen.findByText(/Safari ya/)
    found.unmount()
    page(<Traceability />, '/traceability?code=NOPE')
    await screen.findByText(/Hatuna kundi/)
    expect(missingTranslations()).toEqual([])
  })

  it('quote form: validation errors and success', async () => {
    const user = userEvent.setup()
    page(<Quote />)
    await user.click(screen.getByRole('button', { name: 'Omba nukuu ya bei' }))
    await screen.findByText('Weka jina lako')
    await user.type(screen.getByLabelText('Jina lako'), 'Wanjiru Kamau')
    await user.type(screen.getByLabelText('Simu au WhatsApp'), '0712345678')
    await user.selectOptions(screen.getByRole('combobox'), 'Red Capsicum')
    await user.click(screen.getByRole('button', { name: 'Omba nukuu ya bei' }))
    await screen.findByText('Asante, Wanjiru')
    expect(missingTranslations()).toEqual([])
  })

  it('work with us: validation error shows in Swahili', async () => {
    const user = userEvent.setup()
    page(<WorkWithUs />)
    await user.click(screen.getAllByRole('button', { name: 'Tuma' })[0])
    await screen.findAllByText('Tafadhali jaza sehemu zote tatu.')
    expect(missingTranslations()).toEqual([])
  })
})
