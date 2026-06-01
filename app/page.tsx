'use client'
import { useEffect, useState } from 'react'
import SplashPage from '@/components/SplashPage'
import AuthPage from '@/components/AuthPage'
import Dashboard from '@/components/Dashboard'

type Status = 'splash' | 'auth' | 'app'
type AuthTab = 'login' | 'register'

export default function Home() {
  const [status, setStatus] = useState<Status>('splash')
  const [authTab, setAuthTab] = useState<AuthTab>('login')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Vérifier session Supabase en arrière-plan
    // sans bloquer l'affichage de la splash
    const checkSession = async () => {
      try {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setUser(session.user)
          setStatus('app')
        }
        // Si pas de session → rester sur splash (déjà le cas)
        
        // Écouter les changements d'auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
          if (session) { setUser(session.user); setStatus('app') }
          else setStatus('splash')
        })
        return () => subscription.unsubscribe()
      } catch (e) {
        // Si Supabase échoue → rester sur splash
        console.log('Supabase non disponible')
      }
    }
    checkSession()
  }, [])

  if (status === 'splash') return (
    <SplashPage 
      onLogin={() => { setAuthTab('login'); setStatus('auth') }} 
      onRegister={() => { setAuthTab('register'); setStatus('auth') }} 
    />
  )
  
  if (status === 'auth') return (
    <AuthPage 
      tab={authTab} 
      onSwitchTab={setAuthTab} 
      onBack={() => setStatus('splash')} 
    />
  )
  
  if (status === 'app') return (
    <Dashboard user={user} onLogout={() => setStatus('splash')} />
  )

  return null
}
