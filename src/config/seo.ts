import { site } from './site'

// Used when a page does not set its own title and description (the home page).
export const defaultTitle = `${site.name} ${site.tagline} | Traceable Kenyan Vegetables`
export const defaultDescription =
  'Auxesis Fresh Produce supplies cucumbers, red and yellow capsicum, chillies and butternuts wholesale and retail at Marikiti, sourced from Kenyan farmers with full farm traceability.'

export function pageTitle(title?: string) {
  return title ? `${title} | ${site.name} ${site.tagline}` : defaultTitle
}
