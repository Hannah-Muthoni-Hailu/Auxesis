import { z } from 'zod'
import { cropNames } from '@/data/products'

export const SEVERAL_CROPS = 'Several crops / not sure yet'
export const enquiryCropOptions = [...cropNames, SEVERAL_CROPS]

const phonePattern = /^\+?[\d\s\-()]+$/

// The form works with plain text; toEnquiryPayload() converts it for the database.
export const enquirySchema = z
  .object({
    name: z.string().trim().min(1, 'Enter your name').max(120, 'Keep this under 120 characters'),
    phone: z.string().trim().superRefine((v, ctx) => {
      if (v === '') {
        ctx.addIssue({ code: 'custom', message: 'Enter a phone number we can call or WhatsApp' })
      } else if (!phonePattern.test(v) || v.replace(/\D/g, '').length < 7 || v.length > 30) {
        ctx.addIssue({ code: 'custom', message: 'Enter a valid phone number, for example 0712 345 678' })
      }
    }),
    email: z
      .string()
      .trim()
      .max(200, 'Keep this under 200 characters')
      .refine((v) => v === '' || z.email().safeParse(v).success, 'Enter a valid email, or leave it blank'),
    crop: z.string().max(120),
    quantity: z.string().trim().max(120, 'Keep this under 120 characters'),
    delivery_point: z.string().trim().max(200, 'Keep this under 200 characters'),
    message: z.string().trim().max(2000, 'Keep your message under 2000 characters'),
    // Honeypot: real visitors never see or fill this. Bots often do.
    website: z.string(),
  })
  .superRefine((v, ctx) => {
    if (!v.crop && !v.quantity && !v.message) {
      ctx.addIssue({
        code: 'custom',
        path: ['message'],
        message: 'Tell us which produce you need, or write a short message',
      })
    }
  })

export type EnquiryFormValues = z.infer<typeof enquirySchema>

export interface EnquiryPayload {
  name: string
  phone: string
  email: string | null
  crop: string | null
  quantity: string | null
  delivery_point: string | null
  message: string | null
}

const blankToNull = (v: string) => (v.trim() === '' ? null : v.trim())

export function toEnquiryPayload(v: EnquiryFormValues): EnquiryPayload {
  return {
    name: v.name.trim(),
    phone: v.phone.trim(),
    email: blankToNull(v.email),
    crop: blankToNull(v.crop),
    quantity: blankToNull(v.quantity),
    delivery_point: blankToNull(v.delivery_point),
    message: blankToNull(v.message),
  }
}

// A ready-to-send WhatsApp message built from what the visitor typed.
export function enquiryWhatsAppText(e: Partial<EnquiryPayload>): string {
  const lines = ['Hello Auxesis, I would like a quote.']
  if (e.crop) lines.push(`Produce: ${e.crop}`)
  if (e.quantity) lines.push(`Quantity: ${e.quantity}`)
  if (e.delivery_point) lines.push(`Delivery to: ${e.delivery_point}`)
  if (e.message) lines.push(e.message)
  if (e.name) lines.push(`Name: ${e.name}`)
  return lines.join('\n')
}

// Phone number for a tel: or wa.me link. Local Kenyan numbers (07…, 01…) become 254….
export function toInternationalPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('254')) return digits
  if (digits.startsWith('0')) return `254${digits.slice(1)}`
  if (raw.trim().startsWith('+')) return digits
  return digits.length <= 9 ? `254${digits}` : digits
}
