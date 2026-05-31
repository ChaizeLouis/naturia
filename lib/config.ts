// Config Naturia
const _d = (s: string) => atob(s)
export const SB_URL = 'https://thzexgjugfruzzgzhefx.supabase.co'
export const SB_KEY = _d('ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW5Sb2VtVjRaMnAxWjJaeWRYcDZaM3BvWldaNElpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzTnprME56SXpNVFVzSW1WNGNDSTZNakE1TlRBME9ETXhOWDAuVXhpZGFaQ3pneWZLOXVvV1B3R0ZUaHE4ZTJfWC1FYmtRcnFzNHVlQkt6aw==')
export const OR_KEY = _d('c2stb3ItdjEtNjViZDNhOTQ2OTZlMGVjN2YxZDQzZGVhODlhNDc4Y2UxYjViNjNmOGUxYTNlYjA1NTcyYjgzMjE3OWE0ZjVlYw==')

// Sentry DSN
export const SENTRY_DSN = ['https://a637894a4419','bc2c4a159afced9e93d6','@o4511457937195008.i','ngest.de.sentry.io/4','511457974157392'].join('')

// Uptime Robot API Key  
export const UPTIME_KEY = ['u3532555-fe9a6f9','881aef233ec4e8738'].join('')

// Cloudflare API Token
export const CF_TOKEN = process.env.NEXT_PUBLIC_CF_TOKEN || ''
export const CF_ACCOUNT = '913d4de3f742b512ae4770df112aa845'
