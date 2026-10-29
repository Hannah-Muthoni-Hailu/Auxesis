// The nine produce lines. Used by the Home and Produce pages.
// Photos are optional: drop a file named <slug>.jpg into public/images/produce/
// and it appears automatically; otherwise a coloured panel is shown.

export type GrowingMethod = 'Greenhouse grown' | 'Open field'
export type PackSize = '10kg' | '20kg' | '50kg' | '100kg' | 'tonnes'

export interface Product {
  slug: string
  name: string
  blurb: string
  method: GrowingMethod
  packs: PackSize[]
  packNote: string
  color: string // fallback panel colour when no photo is present
}

export const products: Product[] = [
  {
    slug: 'local-cucumber',
    name: 'Local Cucumber',
    blurb: 'Short, crisp and thin-skinned, the everyday favourite moving fastest at Marikiti.',
    method: 'Open field',
    packs: ['10kg', '20kg', '50kg', 'tonnes'],
    packNote: '10kg / 20kg / 50kg crates · loose or bagged · tonnes on order',
    color: '#8fae4a',
  },
  {
    slug: 'english-cucumber',
    name: 'English Cucumber',
    blurb: 'Long, seedless greenhouse cucumbers graded and sleeved for hotels and supermarkets.',
    method: 'Greenhouse grown',
    packs: ['10kg', '20kg', '100kg', 'tonnes'],
    packNote: '10kg / 20kg crates · sleeved · 100kg and tonnes on order',
    color: '#5f8a3a',
  },
  {
    slug: 'red-capsicum',
    name: 'Red Capsicum',
    blurb: 'Fully ripened sweet peppers, colour-graded and packed in 5kg crates.',
    method: 'Greenhouse grown',
    packs: ['10kg', '20kg', 'tonnes'],
    packNote: '10kg / 20kg crates · colour graded · tonnes on order',
    color: '#c8402f',
  },
  {
    slug: 'yellow-capsicum',
    name: 'Yellow Capsicum',
    blurb: 'Bright, thick-walled yellow peppers grown under net for consistent colour.',
    method: 'Greenhouse grown',
    packs: ['10kg', '20kg', 'tonnes'],
    packNote: '10kg / 20kg crates · colour graded · tonnes on order',
    color: '#e6b422',
  },
  {
    slug: 'chillies',
    name: 'Chillies',
    blurb: 'Bird eye and cayenne chillies, hand-picked and sorted by heat and length.',
    method: 'Open field',
    packs: ['10kg', '20kg', '50kg'],
    packNote: '10kg / 20kg crates · sorted by heat · 50kg on order',
    color: '#a8281d',
  },
  {
    slug: 'butternuts',
    name: 'Butternuts',
    blurb: 'Cured butternut squash with long shelf life, ideal for bulk wholesale runs.',
    method: 'Open field',
    packs: ['20kg', '50kg', '100kg', 'tonnes'],
    packNote: '20kg / 50kg / 100kg nets · cured · tonnes on order',
    color: '#d9a566',
  },
  {
    slug: 'broccoli',
    name: 'Broccoli',
    blurb: 'Tight, deep-green heads cut in the cool of the morning and moved the same day.',
    method: 'Open field',
    packs: ['10kg', '20kg', '50kg'],
    packNote: '10kg / 20kg crates · iced heads · 50kg on order',
    color: '#3f6b3a',
  },
  {
    slug: 'cauliflower',
    name: 'Cauliflower',
    blurb: 'Creamy-white, compact curds grown in the Karatina highlands and trimmed to spec.',
    method: 'Open field',
    packs: ['10kg', '20kg', '50kg'],
    packNote: '10kg / 20kg crates · trimmed & wrapped · 50kg on order',
    color: '#e9e2c8',
  },
  {
    slug: 'zucchini',
    name: 'Zucchini',
    blurb: 'Young, glossy courgettes picked at uniform length for hotels and grocers.',
    method: 'Open field',
    packs: ['10kg', '20kg', '50kg', 'tonnes'],
    packNote: '10kg / 20kg / 50kg crates · size graded · tonnes on order',
    color: '#6f9a45',
  },
]

export const cropNames = products.map((p) => p.name)
