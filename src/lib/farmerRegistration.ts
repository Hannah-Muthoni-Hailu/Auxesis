import { z } from 'zod'

const phonePattern = /^\+?[\d\s\-()]+$/

// The form works with plain text; toRegistrationPayload() converts it for the database.
export const registrationSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(120, 'Keep this under 120 characters'),
  phone: z.string().trim().superRefine((v, ctx) => {
    if (v === '') {
      ctx.addIssue({ code: 'custom', message: 'Enter a phone number we can call or WhatsApp' })
    } else if (!phonePattern.test(v) || v.replace(/\D/g, '').length < 7 || v.length > 30) {
      ctx.addIssue({ code: 'custom', message: 'Enter a valid phone number, for example 0712 345 678' })
    }
  }),
  county: z.string().trim().min(1, 'Enter your county').max(80, 'Keep this under 80 characters'),
  crops: z.string().trim().min(1, 'Tell us what you grow').max(200, 'Keep this under 200 characters'),
  volume: z.string().trim().max(120, 'Keep this under 120 characters'),
  message: z.string().trim().max(2000, 'Keep your message under 2000 characters'),
  // Honeypot: real visitors never see or fill this. Bots often do.
  website: z.string(),
})

export type RegistrationFormValues = z.infer<typeof registrationSchema>

export interface RegistrationPayload {
  name: string
  phone: string
  county: string
  crops: string
  volume: string | null
  message: string | null
}

const blankToNull = (v: string) => (v.trim() === '' ? null : v.trim())

export function toRegistrationPayload(v: RegistrationFormValues): RegistrationPayload {
  return {
    name: v.name.trim(),
    phone: v.phone.trim(),
    county: v.county.trim(),
    crops: v.crops.trim(),
    volume: blankToNull(v.volume),
    message: blankToNull(v.message),
  }
}

// A ready-to-send WhatsApp message built from what the farmer typed.
export function registrationWhatsAppText(r: Partial<RegistrationPayload>): string {
  const lines = ['Hello Auxesis, I would like to grow for you.']
  if (r.crops) lines.push(`Crops: ${r.crops}`)
  if (r.county) lines.push(`County: ${r.county}`)
  if (r.volume) lines.push(`Expected volume: ${r.volume}`)
  if (r.name) lines.push(`Name: ${r.name}`)
  return lines.join('\n')
}
