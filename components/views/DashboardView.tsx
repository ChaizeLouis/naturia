'use client'
import type { Therapist, Patient, Consultation } from '@/lib/supabase'
import type { View } from '../Dashboard'

interface Props {
  therapist: Therapist | null
  patients: Patient[]
  consultations: Consultation[]
  onNav: (v: View) => void
}

export default function DashboardView({ therapist, patients, consultations, onNav }: Props) {
  const prenom = therapist?.prenom || therapist?.email?.split('@')[0] || ''
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const recent = [...consultations].sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()).slice(0, 5)

  const stats = [
    { icon: '👥', label: 'Patients', value: patients.length, sub: 'Total actifs' },
    { icon: '📋', label: 'Consultations', value: consultations.length, sub: 'Total' },
    { icon: '💊', label: 'Protocoles', value: consultations.filter(c => (c.protocole?.length || 0) > 0).length, sub: 'Avec protocole' },
    { icon: '💳', label: 'Abonnement', value: '49 CHF', sub: '/mois' },
  ]

  const s = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '1rem 1.2rem', position: 'relative' as const, overflow: 'hidden' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.6rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 600 }}>Bonjour {prenom} 👋</h1>
          <p style={{ color: 'var(--text2)', fontSize: '.875rem', marginTop: '.2rem' }}>{today}</p>
        </div>
        <button onClick={() => onNav('patients')} style={{ background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 8, padding: '.6rem 1.1rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '.875rem', fontWeight: 500 }}>＋ Nouveau patient</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.4rem' }}>
        {stats.map(st => (
          <div key={st.label} style={s}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--accent)' }} />
            <div style={{ position: 'absolute', top: '.9rem', right: '.9rem', fontSize: '1.2rem' }}>{st.icon}</div>
            <div style={{ fontSize: '.72rem', color: 'var(--text2)', fontWeight: 500, marginBottom: '.4rem' }}>{st.label}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.9rem', fontWeight: 600, lineHeight: 1 }}>{st.value}</div>
            <div style={{ fontSize: '.72rem', color: 'var(--accent)', marginTop: '.25rem' }}>{st.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.2rem' }}>
          <div style={{ fontSize: '.75rem', color: 'var(--text2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.7rem' }}>🕐 Consultations récentes</div>
          {recent.length === 0 ? <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text2)' }}>📋 Aucune consultation</div> :
            recent.map(c => {
              const p = patients.find(x => x.id === c.patient_id)
              return (
                <div key={c.id} style={{ padding: '.5rem 0', borderBottom: '1px solid var(--border2)' }}>
                  <div style={{ fontSize: '.875rem', fontWeight: 500 }}>{c.titre || 'Consultation'}</div>
                  <div style={{ fontSize: '.73rem', color: 'var(--text2)' }}>{p ? `${p.prenom} ${p.nom}` : '—'} · {new Date(c.created_at!).toLocaleDateString('fr-FR')}</div>
                </div>
              )
            })}
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.2rem' }}>
          <div style={{ fontSize: '.75rem', color: 'var(--text2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.7rem' }}>📚 Accès rapide</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
            {([['💊', 'Base suppléments', 'supplements'], ['📋', 'Nouvelle consultation', 'consultations'], ['📅', 'Agenda', 'agenda'], ['⚙️', 'Nova — Support technique', 'nova'], ['📁', 'ARIA — Gestion cabinet', 'aria']] as [string, string, View][]).map(([icon, label, v]) => (
              <button key={v} onClick={() => onNav(v)} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '.6rem 1rem', cursor: 'pointer', color: 'var(--text)', fontFamily: 'inherit', fontSize: '.875rem' }}>
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
