'use client'
import type { View } from '../Dashboard'
import type { Therapist } from '@/lib/supabase'

interface Props {
  view: View
  setView: (v: View) => void
  therapist: Therapist | null
  onLogout: () => void
}

const NAV: { id: View; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'patients', label: 'Patients', icon: '👥' },
  { id: 'supplements', label: 'Suppléments', icon: '💊' },
  { id: 'consultations', label: 'Consultations', icon: '📋' },
  { id: 'agenda', label: 'Agenda', icon: '📅' },
  { id: 'nova', label: 'Nova', icon: '⚙️' },
  { id: 'aria', label: 'ARIA', icon: '📁' },
  { id: 'facturation', label: 'Facturation', icon: '💳' },
  { id: 'support', label: 'Support', icon: '❓' },
]

export default function Sidebar({ view, setView, therapist, onLogout }: Props) {
  const initials = ((therapist?.prenom?.[0] || '') + (therapist?.nom?.[0] || therapist?.email?.[0] || '')).toUpperCase()
  
  return (
    <div style={{ width: 240, background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100, padding: '1.2rem 0' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem', padding: '0 1.2rem 1.4rem', borderBottom: '1px solid var(--border2)', marginBottom: '.9rem' }}>
        <div style={{ width: 34, height: 34, background: 'var(--adim)', border: '1px solid var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌿</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.15rem', color: 'var(--accent)', fontWeight: 600 }}>Naturia</div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '0 .7rem', flex: 1 }}>
        <div style={{ fontSize: '.65rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', padding: '.5rem .5rem .3rem' }}>Navigation</div>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setView(n.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '.6rem', padding: '.55rem .7rem', borderRadius: 8, cursor: 'pointer', width: '100%', textAlign: 'left', border: 'none', fontFamily: 'inherit', fontSize: '.875rem', transition: '.15s', background: view === n.id ? 'var(--adim)' : 'none', color: view === n.id ? 'var(--accent)' : 'var(--text2)', fontWeight: view === n.id ? 500 : 400 }}>
            {n.icon} {n.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '.9rem .7rem 0', borderTop: '1px solid var(--border2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem', padding: '.6rem .7rem', borderRadius: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--adim)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>{initials || '?'}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '.8rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{therapist?.prenom ? `${therapist.prenom} ${therapist.nom || ''}` : therapist?.email}</div>
            <div style={{ fontSize: '.7rem', color: 'var(--text3)' }}>{therapist?.specialite || 'Naturopathe'}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', padding: '.55rem .7rem', borderRadius: 8, cursor: 'pointer', width: '100%', textAlign: 'left', border: 'none', fontFamily: 'inherit', fontSize: '.875rem', background: 'none', color: 'var(--text3)', marginTop: '.2rem' }}>
          🚪 Déconnexion
        </button>
      </div>
    </div>
  )
}
