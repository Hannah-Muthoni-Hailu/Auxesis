import { describe, expect, it } from 'vitest'
import {
  enquirySchema,
  enquiryWhatsAppText,
  toEnquiryPayload,
  toInternationalPhone,
  type EnquiryFormValues,
} from './enquiry'

const valid: EnquiryFormValues = {
  name: 'Jane Wanjiru',
  phone: '0712 345 678',
  email: '',
  crop: 'Zucchini',
  quantity: '',
  delivery_point: '',
  message: '',
  website: '',
}

const messages = (v: Partial<EnquiryFormValues>) => {
  const r = enquirySchema.safeParse({ ...valid, ...v })
  return r.success ? [] : r.error.issues.map((i) => `${String(i.path[0])}: ${i.message}`)
}

describe('enquirySchema', () => {
  it('accepts a minimal request', () => {
    expect(messages({})).toEqual([])
  })

  it('needs a name and a phone number, with one message each', () => {
    expect(messages({ name: ' ', phone: '' })).toEqual([
      'name: Enter your name',
      'phone: Enter a phone number we can call or WhatsApp',
    ])
  })

  it('rejects phone numbers that are not numbers', () => {
    expect(messages({ phone: 'call me' })).toHaveLength(1)
    expect(messages({ phone: '12345' })).toHaveLength(1)
    expect(messages({ phone: '+254 714 073 154' })).toEqual([])
  })

  it('checks the email only when one is given', () => {
    expect(messages({ email: 'nope' })).toEqual(['email: Enter a valid email, or leave it blank'])
    expect(messages({ email: 'a@b.co' })).toEqual([])
  })

  it('wants to know what is needed: a crop, a quantity or a message', () => {
    expect(messages({ crop: '' })).toEqual([
      'message: Tell us which produce you need, or write a short message',
    ])
    expect(messages({ crop: '', message: 'Hello' })).toEqual([])
    expect(messages({ crop: '', quantity: '2 tonnes' })).toEqual([])
  })

  it('keeps text within the database limits', () => {
    expect(messages({ message: 'x'.repeat(2001) })).toHaveLength(1)
    expect(messages({ name: 'x'.repeat(121) })).toHaveLength(1)
  })
})

describe('toEnquiryPayload', () => {
  it('trims, turns blanks into null, and drops the honeypot', () => {
    const p = toEnquiryPayload({ ...valid, name: '  Jane ', website: 'spam' })
    expect(p).toEqual({
      name: 'Jane',
      phone: '0712 345 678',
      email: null,
      crop: 'Zucchini',
      quantity: null,
      delivery_point: null,
      message: null,
    })
    expect(p).not.toHaveProperty('website')
  })
})

describe('phone and WhatsApp helpers', () => {
  it('turns Kenyan numbers into international form', () => {
    expect(toInternationalPhone('0712 345 678')).toBe('254712345678')
    expect(toInternationalPhone('+254 712-345-678')).toBe('254712345678')
    expect(toInternationalPhone('254712345678')).toBe('254712345678')
    expect(toInternationalPhone('712345678')).toBe('254712345678')
  })

  it('builds a readable WhatsApp message', () => {
    const text = enquiryWhatsAppText({ name: 'Jane', crop: 'Zucchini', quantity: '2 tonnes' })
    expect(text).toBe('Hello Auxesis, I would like a quote.\nProduce: Zucchini\nQuantity: 2 tonnes\nName: Jane')
  })
})
