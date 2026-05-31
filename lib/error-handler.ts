'use client'

const MAKE_WEBHOOK = 'https://hook.eu1.make.com/otchv73pv3ffjwflwm8js9haf9mzi6jj'
const SENTRY_DSN = ['https://a637894a4419','bc2c4a159afced9e93d6','@o4511457937195008.i','ngest.de.sentry.io/4','511457974157392'].join('')

let sentryLoaded = false

async function loadSentry() {
  if (sentryLoaded || typeof window === 'undefined') return
  try {
    const Sentry = await import('@sentry/nextjs')
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: 'production',
      beforeSend(event) {
        // Envoyer aussi au webhook Make automatiquement
        notifyMake(event)
        return event
      }
    })
    sentryLoaded = true
  } catch (e) {}
}

async function notifyMake(event: any) {
  try {
    await fetch(MAKE_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: event.exception?.values?.[0]?.value || 'Erreur Naturia',
        level: event.level || 'error',
        project: 'naturia',
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        user: event.user?.email || 'inconnu'
      })
    })
  } catch (e) {}
}

export async function handleError(error: Error, context?: string) {
  console.error(`[Naturia] ${context || ''}:`, error.message)
  await loadSentry()
  try {
    const Sentry = await import('@sentry/nextjs')
    Sentry.captureException(error, {
      tags: { context: context || 'unknown' },
      extra: { timestamp: new Date().toISOString() }
    })
  } catch (e) {
    // Fallback: envoyer directement à Make
    await notifyMake({
      exception: { values: [{ value: error.message }] },
      level: 'error',
      user: { email: 'system' }
    })
  }
}

export function handleApiError(error: any, context: string): string {
  const message = error?.message || 'Erreur inconnue'
  handleError(new Error(message), context)
  return message
}
