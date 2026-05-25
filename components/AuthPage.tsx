'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

const ERRORS: Record<string, string> = {
  'Invalid login credentials': 'Email ou mot de passe incorrect.',
  'User already registered': 'Un compte existe déjà avec cet email.',
  'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères.',
  'email rate limit exceeded': 'Trop de tentatives. Attendez quelques minutes.',
  'For security purposes': 'Veuillez attendre quelques secondes.',
  'Database error': 'Erreur serveur. Réessayez.',
}
function tErr(m: string) {
  for (const [k, v] of Object.entries(ERRORS)) { if (m?.includes(k)) return v }
  return m || 'Une erreur est survenue.'
}

interface Props {
  tab: 'login' | 'register'
  onSwitchTab: (t: 'login' | 'register') => void
  onBack: () => void
}

export default function AuthPage({ tab, onSwitchTab, onBack }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!email || !password) { setError('Email et mot de passe requis'); return }
    setLoading(true)
    try {
      if (tab === 'login') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
      } else {
        if (!prenom || !nom) { setError('Tous les champs sont requis'); setLoading(false); return }
        if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères'); setLoading(false); return }
        const { data, error: err } = await supabase.auth.signUp({ email, password, options: { data: { nom, prenom } } })
        if (err) throw err
        if (data.user) {
          await supabase.from('therapists').update({ nom, prenom }).eq('id', data.user.id)
          await supabase.auth.signInWithPassword({ email, password })
        }
      }
    } catch (e: any) {
      setError(tErr(e.message))
    } finally { setLoading(false) }
  }

  async function forgotPassword() {
    if (!email) { setError('Entrez votre email ci-dessus'); return }
    await supabase.auth.resetPasswordForEmail(email)
    setSuccess('Email de réinitialisation envoyé !')
  }

  const inp = {
    style: { width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '.65rem .9rem', color: 'var(--text)', fontSize: '.9rem', fontFamily: 'inherit', outline: 'none' } as React.CSSProperties
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 30% 50%,rgba(63,182,139,0.08),transparent 60%),var(--bg)' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '2.4rem', width: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
        
        {/* Logo + Back */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}>
            <div style={{ width: 36, height: 36, background: 'var(--adim)', border: '1px solid var(--accent)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌿</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', color: 'var(--accent)', fontWeight: 600 }}>Naturia</div>
          </div>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: '.82rem', textDecoration: 'underline' }}>← Retour</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1.4rem', background: 'var(--bg3)', borderRadius: 8, padding: '.22rem' }}>
          {(['login', 'register'] as const).map(t => (
            <button key={t} onClick={() => { onSwitchTab(t); setError(''); setSuccess('') }}
              style={{ flex: 1, padding: '.45rem', textAlign: 'center', borderRadius: 6, cursor: 'pointer', fontSize: '.85rem', border: 'none', fontFamily: 'inherit', transition: '.2s', background: tab === t ? 'var(--accent)' : 'none', color: tab === t ? '#000' : 'var(--text2)', fontWeight: tab === t ? 600 : 400 }}>
              {t === 'login' ? 'Connexion' : 'Créer un compte'}
            </button>
          ))}
        </div>

        {error && <div style={{ background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 8, padding: '.65rem .9rem', marginBottom: '1rem', fontSize: '.85rem', color: 'var(--danger)' }}>{error}</div>}
        {success && <div style={{ background: 'rgba(63,182,139,0.1)', border: '1px solid rgba(63,182,139,0.3)', borderRadius: 8, padding: '.65rem .9rem', marginBottom: '1rem', fontSize: '.85rem', color: 'var(--accent)' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.7rem', marginBottom: '.9rem' }}>
              <div><label style={{ display: 'block', fontSize: '.78rem', color: 'var(--text2)', marginBottom: '.35rem' }}>Prénom</label>
                <input {...inp} value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Amandine" /></div>
              <div><label style={{ display: 'block', fontSize: '.78rem', color: 'var(--text2)', marginBottom: '.35rem' }}>Nom</label>
                <input {...inp} value={nom} onChange={e => setNom(e.target.value)} placeholder="Martin" /></div>
            </div>
          )}
          <div style={{ marginBottom: '.9rem' }}>
            <label style={{ display: 'block', fontSize: '.78rem', color: 'var(--text2)', marginBottom: '.35rem' }}>Email professionnel</label>
            <input {...inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@cabinet.com" />
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '.78rem', color: 'var(--text2)', marginBottom: '.35rem' }}>Mot de passe{tab === 'register' ? ' (6 car. minimum)' : ''}</label>
            <input {...inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 10, padding: '.85rem', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? .7 : 1 }}>
            {loading ? '…' : tab === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
          {tab === 'login' && (
            <div style={{ textAlign: 'center', marginTop: '.75rem' }}>
              <button type="button" onClick={forgotPassword} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: '.82rem', cursor: 'pointer', textDecoration: 'underline' }}>Mot de passe oublié ?</button>
            </div>
          )}
        </form>

        <div style={{ marginTop: '1.3rem', textAlign: 'center', fontSize: '.75rem', color: 'var(--text3)' }}>
          🔒 Données hébergées en Europe · RGPD conforme
        </div>
      </div>
    </div>
  )
}
