'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { Therapist, Patient, Consultation } from '@/lib/supabase'
import Sidebar from './layout/Sidebar'
import DashboardView from './views/DashboardView'
import PatientsView from './views/PatientsView'
import SupplementsView from './views/SupplementsView'
import ConsultationsView from './views/ConsultationsView'
import AgendaView from './views/AgendaView'
import ChatView from './views/ChatView'
import FacturationView from './views/FacturationView'
import SupportView from './views/SupportView'

export type View = 'dashboard'|'patients'|'supplements'|'consultations'|'agenda'|'nova'|'aria'|'facturation'|'support'

interface Props {
  user: any
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: Props) {
  const [view, setView] = useState<View>('dashboard')
  const [therapist, setTherapist] = useState<Therapist | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [{ data: th }, { data: ps }, { data: cs }] = await Promise.all([
        supabase.from('therapists').select('*').eq('id', user.id).single(),
        supabase.from('patients').select('*').eq('therapist_id', user.id).order('created_at', { ascending: false }),
        supabase.from('consultations').select('*').eq('therapist_id', user.id).order('created_at', { ascending: false }),
      ])
      setTherapist(th || { id: user.id, email: user.email })
      setPatients(ps || [])
      setConsultations(cs || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function logout() {
    await supabase.auth.signOut()
    onLogout()
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '.75rem', color: 'var(--text2)' }}>
      <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      Chargement…
    </div>
  )

  const viewProps = { therapist, patients, setPatients, consultations, setConsultations, supabase, user }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar view={view} setView={setView} therapist={therapist} onLogout={logout} />
      <main style={{ marginLeft: 240, flex: 1, padding: '2rem', minHeight: '100vh', background: 'var(--bg)' }}>
        {view === 'dashboard' && <DashboardView {...viewProps} onNav={setView} />}
        {view === 'patients' && <PatientsView {...viewProps} />}
        {view === 'supplements' && <SupplementsView />}
        {view === 'consultations' && <ConsultationsView {...viewProps} />}
        {view === 'agenda' && <AgendaView {...viewProps} />}
        {view === 'nova' && <ChatView therapist={therapist} mode="nova" />}
        {view === 'aria' && <ChatView therapist={therapist} mode="aria" />}
        {view === 'facturation' && <FacturationView therapist={therapist} />}
        {view === 'support' && <SupportView />}
      </main>
    </div>
  )
}
