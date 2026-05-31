'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import SplashPage from '@/components/SplashPage'
import AuthPage from '@/components/AuthPage'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  const [status, setStatus] = useState<'loading'|'splash'|'auth'|'app'>('loading')
  const [user, setUser] = useState<any>(null)
  const [authTab, setAuthTab] = useState<'login'|'register'>('login')

  useEffect(() => {
    const supabase = createClient()
    
    // Timeout de sécurité : si Supabase met trop de temps → splash
    const timeout = setTimeout(() => setStatus('splash'), 3000)
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout)
      if (session) { setUser(session.user); setStatus('app') }
      else setStatus('splash')
    }).catch(() => {
      clearTimeout(timeout)
      setStatus('splash')
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) { setUser(session.user); setStatus('app') }
      else if (status !== 'loading') setStatus('splash')
    })
    
    return () => { subscription.unsubscribe(); clearTimeout(timeout) }
  }, [])

  if (status === 'loading') return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',gap:'.75rem',color:'var(--text2)'}}>
      <div className="spinner" />
      <span style={{fontFamily:'Fraunces, serif',fontSize:'1.25rem',color:'var(--accent)'}}>Naturia</span>
    </div>
  )

  if (status === 'splash') return <SplashPage onLogin={() => { setAuthTab('login'); setStatus('auth') }} onRegister={() => { setAuthTab('register'); setStatus('auth') }} />
  if (status === 'auth') return <AuthPage tab={authTab} onSwitchTab={setAuthTab} onBack={() => setStatus('splash')} />
  if (status === 'app') return <Dashboard user={user} onLogout={() => setStatus('splash')} />

  return null
}
