export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { init } = await import('@sentry/nextjs')
    const { SENTRY_DSN } = await import('./lib/config')
    init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: 'production',
    })
  }
}
