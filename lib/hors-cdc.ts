'use client'

const WEBHOOK_HORS_CDC = 'https://hook.eu1.make.com/b5veyl87o8kskjsxxdw47wed512zhw26'

export interface DemandeHorsCDC {
  therapeute_email: string
  therapeute_nom: string
  specialite: string
  agent: 'ARIA' | 'Nova'
  demande: string
  timestamp: string
}

// Envoyer la demande hors CDC à Tony via Make
export async function notifierDemandeHorsCDC(demande: DemandeHorsCDC): Promise<void> {
  try {
    await fetch(WEBHOOK_HORS_CDC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...demande,
        timestamp: new Date().toISOString(),
        source: 'Naturia',
        priorite: 'haute',
        message_tony: `🆕 NOUVELLE DEMANDE HORS CDC\n\nThérapeute: ${demande.therapeute_nom} (${demande.therapeute_email})\nSpécialité: ${demande.specialite}\nAgent: ${demande.agent}\nDemande: ${demande.demande}\n\n→ Intégrer rapidement pour servir ce client.`
      })
    })
  } catch (e) {
    console.error('Erreur notification hors CDC:', e)
  }
}

// Message standard à afficher au thérapeute
export const MESSAGE_HORS_CDC = (agent: string, demande: string) => `
Je comprends parfaitement votre besoin concernant "${demande}". 

Cette fonctionnalité n'est pas encore disponible dans mes capacités actuelles, mais je transmets immédiatement votre demande à l'équipe Resilya.

Vous serez contacté dans les plus brefs délais dès que cette fonctionnalité sera disponible. Notre objectif est de vous offrir exactement ce dont vous avez besoin pour votre pratique.

Merci de votre confiance. 🌿
`.trim()
