import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { sw } from './sw'

export type Lang = 'en' | 'sw'

const STORAGE_KEY = 'auxesis-lang'

// Texts that were asked for in Swahili but have no translation yet. Tests read this.
const missing = new Set<string>()
export const missingTranslations = () => [...missing].sort()
export const clearMissingTranslations = () => missing.clear()

// The language in use, readable from plain functions (dates) that are not components.
let current: Lang = 'en'
export const currentLang = () => current

function fill(text: string, vars?: Record<string, string | number>) {
  return vars ? text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : text
}

export function translate(lang: Lang, text: string, vars?: Record<string, string | number>): string {
  if (lang === 'en') return fill(text, vars)
  const hit = sw[text]
  if (hit === undefined) {
    missing.add(text)
    return fill(text, vars)
  }
  return fill(hit, vars)
}

export type TFn = (text: string, vars?: Record<string, string | number>) => string

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: TFn
}

// Outside a provider (for example in small tests) everything stays in English.
const LangContext = createContext<LangContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (text, vars) => translate('en', text, vars),
})

function readSaved(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'sw' ? 'sw' : 'en'
  } catch {
    return 'en'
  }
}

export function LangProvider({ children, initial }: { children: ReactNode; initial?: Lang }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const start = initial ?? readSaved()
    current = start
    if (typeof document !== 'undefined') document.documentElement.lang = start
    return start
  })

  const setLang = useCallback((next: Lang) => {
    current = next
    document.documentElement.lang = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private browsing: the choice just lasts until the page is closed.
    }
    setLangState(next)
  }, [])

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, t: (text, vars) => translate(lang, text, vars) }),
    [lang, setLang],
  )
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

export function useT(): TFn {
  return useContext(LangContext).t
}
