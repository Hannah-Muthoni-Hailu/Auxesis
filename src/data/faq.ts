// The questions and answers on the FAQ page. Edit the wording here and the page updates.
//
// Answers marked "NEEDS CONFIRMING" are careful drafts that do not promise anything specific.
// Replace them with your real figures and terms when you have them.

import { products } from './products'

export interface FaqItem {
  q: string
  a: string
  /** Optional link shown under the answer. */
  link?: { to: string; label: string }
}

export interface FaqGroup {
  id: string
  title: string
  intro: string
  items: FaqItem[]
}

const names = (method: 'Greenhouse grown' | 'Open field') =>
  products.filter((p) => p.method === method).map((p) => p.name)

const list = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`

export const faqGroups: FaqGroup[] = [
  {
    id: 'buyers',
    title: 'Buying from us',
    intro: 'For traders, grocers, hotels and households.',
    items: [
      {
        q: 'Where is the produce from?',
        a: 'Our own farm is in Karatina, Nyeri County. The rest comes from commercial growers we work with in other parts of Kenya. Every batch on the Farm Tracker shows which farm and county it came from.',
        link: { to: '/tracker', label: 'See the Farm Tracker' },
      },
      {
        q: 'What variety is it?',
        a: 'It depends on the crop and the grower, and the variety is recorded for each batch on the Farm Tracker. Tell us the crop when you ask for a quote and we will confirm the variety available.',
        link: { to: '/tracker', label: 'See batches and varieties' },
      },
      {
        q: 'Is it open field or greenhouse?',
        a: `Greenhouse grown: ${list(names('Greenhouse grown'))}. Open field: ${list(names('Open field'))}. The Produce page shows the growing method on each crop.`,
        link: { to: '/produce', label: 'See our produce' },
      },
      {
        // NEEDS CONFIRMING: spray records are not yet stored on the site.
        q: 'When was it last sprayed?',
        a: 'Our growers follow agreed spray programmes. The site does not show spray dates yet, so ask us about the specific batch you want when you request a quote and we will tell you.',
        link: { to: '/quote', label: 'Request a quote' },
      },
      {
        // NEEDS CONFIRMING: add a typical shelf life per crop.
        q: 'What is the shelf life of the produce?',
        a: 'It depends on the crop, how it is stored and how far it travels. Butternuts are cured for a long shelf life, while broccoli is cut in the cool of the morning, iced and moved the same day. Tell us the crop and where it is going and we will advise.',
      },
      {
        q: 'When is the next harvest?',
        a: 'Every batch on the Farm Tracker shows its stage and its expected harvest date, updated by the farmers who grow it. Check there for what is coming, or ask us about a crop you need.',
        link: { to: '/tracker', label: 'Check expected harvest dates' },
      },
      {
        // NEEDS CONFIRMING: supply periods per crop.
        q: 'How long will you be harvesting and supplying?',
        a: 'We plant in staggered batches so there is normally something coming through. For a regular weekly order, tell us the crop and quantity and we will confirm how long we can supply it.',
        link: { to: '/quote', label: 'Request a quote' },
      },
      {
        // NEEDS CONFIRMING: delivery coverage, cost and timing.
        q: 'Can you deliver to places far from Nairobi, like Garissa or Kongowea (Mombasa)?',
        a: 'We can discuss delivery to markets outside Nairobi. Cost and timing depend on the crop, the quantity and the transport. Give us the destination in the quote form and we will come back with what is possible.',
        link: { to: '/quote', label: 'Request a quote' },
      },
    ],
  },
  {
    id: 'farmers',
    title: 'Growing for us',
    intro: 'For farmers who want to supply Auxesis.',
    items: [
      {
        // NEEDS CONFIRMING: add real weekly capacity per crop if you want to state it.
        q: 'What is your offtake capacity?',
        a: 'It depends on the crop and the season, and it grows as we add buyers. Tell us what you grow, how much you expect per week and when it will be ready, and we will confirm what we can take before you plant.',
        link: { to: '/work-with-us#farmers', label: 'Tell us what you grow' },
      },
      {
        q: 'If I grow for you, will I be sure of a consistent market?',
        a: 'We work with growers on agreed varieties, planting calendars and farm-gate prices, so you plant knowing what we will buy. The market is assured for what we agree together before planting: the crop, the volume, the timing and the quality. We cannot promise to buy produce that was not agreed.',
        link: { to: '/work-with-us#farmers', label: 'Partner with us' },
      },
      {
        q: 'What are your terms of payment?',
        a: 'Farmers are paid promptly, at the agreed grade and price, once produce is collected and graded. The details are confirmed with you at registration, before you plant.',
        link: { to: '/work-with-us#farmers', label: 'Register your farm' },
      },
      {
        q: 'Do you charge farmers a fee?',
        a: 'There is no fee on crops Auxesis buys directly from you. For crops we do not buy ourselves, we link you to buyers in our network and charge a fee only when a sale is completed.',
        link: { to: '/work-with-us#farmers', label: 'Register your farm' },
      },
    ],
  },
]

export const faqCount = faqGroups.reduce((n, g) => n + g.items.length, 0)
