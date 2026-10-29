// Single place to edit business details used across the site.
export const site = {
  name: 'Auxesis',
  tagline: 'Fresh Produce',
  farm: 'Karatina, Nyeri County, Kenya',
  markets: 'Marikiti & City Park, Nairobi',
  stall: 'Wakulima (Marikiti) Market, Haile Selassie Avenue, Nairobi',
  phone: '+254 714 073 154',
  whatsappNumber: '254714073154',
  email: 'sales@auxesisproduce.co.ke',
  hours: 'Monday to Saturday, 4:00am – 6:00pm at Marikiti and City Park. Farm visits by appointment.',
} as const

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/produce', label: 'Produce' },
  { to: '/traceability', label: 'Farm Tracker' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

export function whatsappLink(message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${site.whatsappNumber}${text}`
}
