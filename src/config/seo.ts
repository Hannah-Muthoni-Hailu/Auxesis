import { site } from './site'

// Used when a page does not set its own title and description (the home page).
export const defaultTitle = `${site.name} ${site.tagline} | Traceable Kenyan Vegetables`
export const defaultDescription =
  'We grow, buy and connect Kenyan fresh produce to market. Cucumbers, capsicum, chillies and butternuts from our Karatina farm and contracted farmers, with every batch traceable.'

export function pageTitle(title?: string) {
  return title ? `${title} | ${site.name} ${site.tagline}` : defaultTitle
}
