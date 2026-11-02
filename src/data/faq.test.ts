import { describe, expect, it } from 'vitest'
import { answerText, faqCount, faqGroups } from './faq'
import { translate } from '@/i18n'
import { products } from './products'

describe('faq data', () => {
  it('has the 12 questions, 8 for buyers and 4 for farmers', () => {
    expect(faqCount).toBe(12)
    expect(faqGroups.map((g) => g.items.length)).toEqual([8, 4])
  })

  it('has a non-empty question and answer for every item, and no duplicates', () => {
    const questions = faqGroups.flatMap((g) => g.items.map((i) => i.q))
    expect(new Set(questions).size).toBe(questions.length)
    for (const item of faqGroups.flatMap((g) => g.items)) {
      expect(item.q.trim()).not.toBe('')
      expect(answerText(item, (x) => translate('en', x)).trim().length).toBeGreaterThan(40)
    }
  })

  it('answers the growing-method question from the product list, so it cannot drift', () => {
    const answer = answerText(faqGroups[0].items.find((i) => i.q.includes('open field or greenhouse'))!, (x) => translate('en', x))
    for (const p of products) expect(answer).toContain(p.name)
    const greenhouse = answer.split('Open field:')[0]
    for (const p of products.filter((p) => p.method === 'Greenhouse grown')) expect(greenhouse).toContain(p.name)
    for (const p of products.filter((p) => p.method === 'Open field')) expect(greenhouse).not.toContain(p.name)
  })

  it('only links to pages that exist', () => {
    const pages = ['/', '/produce', '/traceability', '/tracker', '/stories', '/about', '/faq', '/work-with-us', '/contact', '/quote']
    for (const item of faqGroups.flatMap((g) => g.items)) {
      if (item.link) expect(pages).toContain(item.link.to.split('#')[0])
    }
  })
})
