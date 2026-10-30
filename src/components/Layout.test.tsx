import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Layout from './Layout'

function GoToB() {
  const navigate = useNavigate()
  return <button onClick={() => void navigate('/b')}>Go to B</button>
}

describe('Layout', () => {
  afterEach(() => vi.restoreAllMocks())

  it('scrolls to the top on every page change, even if the browser returns a value from scrollTo', async () => {
    // Newer browsers can return a Promise from scrollTo. React must not treat it as a cleanup function.
    const scroll = vi.spyOn(window, 'scrollTo').mockImplementation((() => Promise.resolve()) as never)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={['/a']}>
        <GoToB />
        <Routes>
          <Route element={<Layout />}>
            <Route path="a" element={<p>Page A</p>} />
            <Route path="b" element={<p>Page B</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Page A')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Go to B' }))

    expect(screen.getByText('Page B')).toBeInTheDocument()
    expect(scroll).toHaveBeenCalledTimes(2)
    expect(consoleError).not.toHaveBeenCalled()
  })
})
