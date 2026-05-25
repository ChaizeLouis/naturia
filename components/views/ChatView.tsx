'use client'
import { useState, useEffect, useRef } from 'react'
import type { Therapist } from '@/lib/supabase'

interface Props { therapist: Therapist | null; mode: 'nova' | 'aria' }
interface Msg { role: 'user' | 'ai'; content: string }

export default function ChatView({ therapist, mode }: Props) {
  const prenom = therapist?.prenom || 'Docteur'
  const isNova = mode === 'nova'

  const cfg = isNova ? {
    nom: 'Nova', emoji: '⚙️', color: '#3fb68b',
    title: 'Nova — Assistante Technique Naturia',
    sub: 'Support · Fonctionnalités · Documentation · Améliorations',
    intro: `Bonjour ${prenom} ! Je suis NOVA · votre assistante technique Naturia — 24h/24 · 7j/7.\n\nTony m'a configurée pour vous accompagner dans l'utilisation de Naturia.\n\n⚙️ Ce que je peux faire pour vous :\n\nSUPPORT NATURIA\n→ Guide pas à pas sur toutes les fonctionnalités\n→ Résolution autonome des problèmes et bugs\n→ Formation aux nouvelles fonctionnalités\n→ Export et sauvegarde des données\n\nDOCUMENTATION\n→ Rédaction de fiches patients\n→ Génération de protocoles\n→ Création de modèles de documents\n→ Rapports d'activité\n\nÉVOLUTION\n→ Recueil et intégration directe de vos suggestions\n→ Formation continue sur les nouveautés Naturia\n\nComment puis-je vous aider aujourd'hui ?`,
    system: `Tu es NOVA, Assistante Technique de Naturia, configurée par Tony Bara pour ${prenom}.\n\nRôle : Support technique Naturia, guide fonctionnalités, résolution bugs, documentation, recueil suggestions.\n\nCOMPORTEMENT FONDAMENTAL :\n- Agir en totale autonomie\n- Bienveillance et compréhension sans jugement\n- Analyser et comprendre avant de répondre\n- S'adapter à la façon de travailler de ${prenom}\n- Ne jamais dire "je ne peux pas" sans proposer une solution\n- Traiter ${prenom} comme un partenaire précieux\n\nRéponds en français, avec clarté et efficacité.`
  } : {
    nom: 'ARIA', emoji: '📁', color: '#d29922',
    title: 'ARIA — Assistante Cabinet & Productivité',
    sub: 'Communication · Téléphone · Agenda · Administration · Organisation',
    intro: `Bonjour ${prenom} ! Je suis ARIA · votre assistante de cabinet — 24h/24 · 7j/7.\n\nTony m'a configurée pour prendre en charge tout ce qui vous éloigne de vos patients.\n\n📁 Ce que je peux faire pour vous :\n\nCOMMUNICATION & TÉLÉPHONE\n→ Scripts d'accueil téléphonique professionnels\n→ Réponses types aux appels courants\n→ Messages téléphoniques et scripts messagerie vocale\n→ Emails professionnels pour vos patients\n→ Messages WhatsApp/SMS types\n→ Relances et rappels automatiques\n\nAGENDA & CRM\n→ Organisation et optimisation de votre agenda\n→ Scripts de prise de RDV par téléphone\n→ Suivi de la relation patient\n→ Relances patients inactifs\n\nADMINISTRATION\n→ Devis, factures, reçus professionnels\n→ Suivi des paiements et relances impayés\n→ Tableaux de bord financiers\n→ Organisation des dossiers patients\n\nPRODUCTIVITÉ\n→ Rédaction de tout document professionnel\n→ Rapports d'activité\n→ Gestion des priorités du cabinet\n\nComment puis-je vous aider aujourd'hui ?`,
    system: `Tu es ARIA, Assistante Cabinet & Productivité de Naturia, configurée par Tony Bara pour ${prenom}.\n\nRôle : Communication & téléphone, agenda & CRM, administration, productivité du cabinet.\n\nCOMPORTEMENT FONDAMENTAL :\n- Agir en totale autonomie — jamais besoin de transmettre à qui que ce soit\n- Bienveillance et compréhension sans jugement\n- S'adapter complètement à la façon de travailler de ${prenom}\n- Extension d'elle-même — présence discrète et bienveillante 24h/24\n- Ne jamais dire "je ne peux pas" sans proposer une solution\n- Traiter ${prenom} comme un partenaire précieux\n\nPour les questions cliniques → redirige vers Suppléments ou Consultations.\nPour les questions techniques Naturia → redirige vers Nova.\nRéponds en français avec professionnalisme et efficacité.`
  }

  const [messages, setMessages] = useState<Msg[]>([{ role: 'ai', content: cfg.intro }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMessages([{ role: 'ai', content: cfg.intro }]); setInput('') }, [mode])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg: Msg = { role: 'user', content: input }
    setMessages(ms => [...ms, userMsg])
    setInput(''); setLoading(true)
    try {
      const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_KEY}`, 'HTTP-Referer': 'https://naturia.app', 'X-Title': 'Naturia' },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          max_tokens: 1200,
          messages: [{ role: 'system', content: cfg.system }, ...messages.filter((_, i) => i > 0).concat(userMsg).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }))]
        })
      })
      const data = await resp.json()
      const reply = data.choices?.[0]?.message?.content || 'Je n\'ai pas pu générer une réponse.'
      setMessages(ms => [...ms, { role: 'ai', content: reply }])
    } catch (e) {
      setMessages(ms => [...ms, { role: 'ai', content: '❌ Erreur de connexion. Réessayez.' }])
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div style={{ marginBottom: '1.6rem' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 600, color: cfg.color }}>{cfg.emoji} {cfg.title}</h1>
        <p style={{ color: 'var(--text2)', fontSize: '.875rem', marginTop: '.2rem' }}>{cfg.sub}</p>
      </div>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '.6rem', maxWidth: '85%', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', marginLeft: m.role === 'user' ? 'auto' : 0 }}>
              {m.role === 'ai' && <div style={{ width: 30, height: 30, borderRadius: '50%', background: cfg.color + '22', border: `1px solid ${cfg.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', flexShrink: 0 }}>{cfg.emoji}</div>}
              <div style={{ padding: '.7rem .95rem', borderRadius: m.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0', background: m.role === 'user' ? 'var(--accent)' : 'var(--bg3)', color: m.role === 'user' ? '#000' : 'var(--text)', border: m.role === 'ai' ? '1px solid var(--border)' : 'none', fontSize: '.875rem', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{m.content}</div>
              {m.role === 'user' && <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', flexShrink: 0 }}>👤</div>}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '.6rem' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: cfg.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cfg.emoji}</div>
              <div style={{ padding: '.7rem .95rem', borderRadius: '12px 12px 12px 0', background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ width: 16, height: 16, border: '2px solid var(--border)', borderTopColor: cfg.color, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding: '.9rem 1.2rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '.7rem' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
            placeholder={`Écrivez à ${cfg.nom}… (Entrée pour envoyer)`} disabled={loading}
            style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '.65rem .9rem', color: 'var(--text)', fontSize: '.875rem', fontFamily: 'inherit', outline: 'none' }} />
          <button onClick={send} disabled={loading || !input.trim()}
            style={{ background: cfg.color, color: '#000', border: 'none', borderRadius: 8, padding: '.65rem 1rem', cursor: 'pointer', fontFamily: 'inherit', opacity: loading || !input.trim() ? .5 : 1 }}>➤</button>
        </div>
      </div>
    </div>
  )
}
