// Content for the home page sections that are not products. Edit here.

export const audiences = [
  {
    tag: 'For buyers',
    title: 'Source produce',
    text: 'Hotels, supermarkets, exporters, processors and Marikiti traders. Steady volumes, graded to spec, with records for every batch.',
    cta: 'Request a supply quote',
    to: '/quote',
  },
  {
    tag: 'For farmers',
    title: 'Sell your produce',
    text: 'We buy what we grow ourselves, and link you to buyers for everything else. Clear grades, clear fees, prompt payment.',
    cta: 'Register your farm',
    to: '/work-with-us#farmers',
  },
]

export const whatWeDo = [
  {
    n: '01',
    title: 'We grow',
    text: 'Cucumbers, red and yellow capsicum, chillies and butternuts from our own farm in Karatina, sold wholesale and retail at Marikiti.',
  },
  {
    n: '02',
    title: 'We buy',
    text: 'As an offtaker, we buy the same crops from contracted farmers at an agreed grade and price, and collect from the farm.',
  },
  {
    n: '03',
    title: 'We connect',
    text: "For crops we don't grow, we link farmers to buyers in our network for a fee charged only when a sale is completed.",
  },
]

// Prices are not published yet, so the board shows a dash until real figures are added.
export const marketBoard = [
  { item: 'Cucumbers', unit: 'KES per kg', price: null as number | null },
  { item: 'Red capsicum', unit: 'KES per kg', price: null as number | null },
  { item: 'Yellow capsicum', unit: 'KES per kg', price: null as number | null },
  { item: 'Chillies', unit: 'KES per kg', price: null as number | null },
  { item: 'Butternuts', unit: 'KES per piece', price: null as number | null },
]

// Placeholder story titles carried over from the Lovable site. Replace with real articles.
export const stories = [
  { tag: 'Farmers', title: 'Growing grade-A capsicum in Central Kenya', meta: 'Guide · 6 min' },
  { tag: 'Market', title: 'Fresh produce outlook for November', meta: 'Market report · 3 min' },
  { tag: 'Stories', title: 'Farmer profile: selling beyond the local broker', meta: 'Profile · 5 min' },
]
