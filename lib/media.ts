'use client'

// ═══════════════════════════════════════════════════
// RESILYA — Module Médias : Musique, Son, Voix, Vidéo
// Outils 100% gratuits au lancement
// ═══════════════════════════════════════════════════

// ────────────────────────────────────────
// 1. MUSIQUE IA — Jamendo (gratuit illimité)
// ────────────────────────────────────────
const JAMENDO_CLIENT_ID = process.env.NEXT_PUBLIC_JAMENDO_CLIENT_ID || 'demo'

export type SpecialiteThérapeute = 
  | 'naturopathe' | 'sophrologue' | 'hypnothérapeute' 
  | 'reflexologue' | 'nutritionniste' | 'psychothérapeute' | 'autre'

const TAGS_MUSIQUE: Record<SpecialiteThérapeute, string> = {
  naturopathe: 'nature,ambient,healing',
  sophrologue: 'relaxation,meditation,calm',
  hypnothérapeute: 'ambient,deep,meditation',
  reflexologue: 'zen,spa,peaceful',
  nutritionniste: 'uplifting,positive,energy',
  psychothérapeute: 'calm,soft,gentle',
  autre: 'ambient,wellness,peaceful'
}

export async function getMusiqueAmbiance(specialite: SpecialiteThérapeute, limit = 5) {
  try {
    const tags = TAGS_MUSIQUE[specialite]
    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&tags=${tags}&include=musicinfo&audioformat=mp32`
    const res = await fetch(url)
    const data = await res.json()
    return data.results || []
  } catch {
    return []
  }
}

// ────────────────────────────────────────
// 2. VOIX IA — Google Cloud TTS (4M chars/mois gratuit)
// ────────────────────────────────────────
export async function synthétiserVoix(
  texte: string,
  langue: 'fr-FR' | 'en-US' | 'de-DE' = 'fr-FR',
  voix: string = 'fr-FR-Neural2-C'
): Promise<string | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TTS_KEY
    if (!apiKey) return null

    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: texte },
          voice: { languageCode: langue, name: voix },
          audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95, pitch: 0 }
        })
      }
    )
    const data = await res.json()
    if (data.audioContent) {
      return `data:audio/mp3;base64,${data.audioContent}`
    }
    return null
  } catch {
    return null
  }
}

// Voix disponibles en français (toutes gratuites)
export const VOIX_FRANÇAISES = [
  { id: 'fr-FR-Neural2-A', nom: 'Sophie', genre: 'F', qualite: 'Neural' },
  { id: 'fr-FR-Neural2-B', nom: 'Pierre', genre: 'M', qualite: 'Neural' },
  { id: 'fr-FR-Neural2-C', nom: 'Marie', genre: 'F', qualite: 'Neural' },
  { id: 'fr-FR-Neural2-D', nom: 'Lucas', genre: 'M', qualite: 'Neural' },
  { id: 'fr-FR-Neural2-E', nom: 'Léa', genre: 'F', qualite: 'Neural' },
]

// ────────────────────────────────────────
// 3. PHOTOS THÉRAPEUTES — Cloudinary (25GB gratuit)
// ────────────────────────────────────────
const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''
const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'naturia_therapeutes'

export async function uploadPhotoThérapeute(file: File): Promise<{
  url: string
  urlOptimisée: string
  urlProfil: string
} | null> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_PRESET)
    formData.append('folder', 'therapeutes')
    formData.append('tags', 'therapeute,naturia,profil')

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method: 'POST', body: formData }
    )
    const data = await res.json()
    
    if (data.secure_url) {
      const baseUrl = data.secure_url
      const pubId = data.public_id
      
      return {
        url: baseUrl,
        // Version optimisée automatiquement
        urlOptimisée: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/q_auto,f_auto/${pubId}`,
        // Version profil circulaire 400x400
        urlProfil: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/w_400,h_400,c_fill,g_face,r_max,q_auto/${pubId}`
      }
    }
    return null
  } catch {
    return null
  }
}

export async function uploadVidéoThérapeute(file: File): Promise<{
  url: string
  thumbnail: string
} | null> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_PRESET)
    formData.append('folder', 'therapeutes/videos')
    formData.append('resource_type', 'video')

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/video/upload`,
      { method: 'POST', body: formData }
    )
    const data = await res.json()
    
    if (data.secure_url) {
      return {
        url: data.secure_url,
        thumbnail: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/so_0,w_600/${data.public_id}.jpg`
      }
    }
    return null
  } catch {
    return null
  }
}

// ────────────────────────────────────────
// 4. AVATAR PARLANT — D-ID (5min gratuit)
// ────────────────────────────────────────
export async function créerAvatarParlant(
  photoUrl: string,
  texte: string,
  voixId: string = 'fr-FR-Neural2-C'
): Promise<string | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_DID_API_KEY
    if (!apiKey) return null

    const res = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_url: photoUrl,
        script: {
          type: 'text',
          input: texte,
          provider: {
            type: 'google',
            voice_id: voixId
          }
        },
        config: { fluent: true, pad_audio: 0.5 }
      })
    })
    const data = await res.json()
    return data.id || null
  } catch {
    return null
  }
}

// ────────────────────────────────────────
// 5. SONS EFFETS — Freesound (gratuit)
// ────────────────────────────────────────
export async function getSonsAmbiance(query: string, limit = 3): Promise<any[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FREESOUND_API_KEY
    if (!apiKey) return []
    
    const res = await fetch(
      `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&token=${apiKey}&fields=id,name,previews&filter=duration:[0+TO+60]&sort=rating_desc&page_size=${limit}`
    )
    const data = await res.json()
    return data.results || []
  } catch {
    return []
  }
}

// ────────────────────────────────────────
// EXPORT CONFIG VARIABLES D'ENVIRONNEMENT
// ────────────────────────────────────────
export const MEDIA_CONFIG = {
  cloudinary: {
    cloudName: CLOUDINARY_CLOUD,
    uploadPreset: CLOUDINARY_PRESET,
  },
  google: {
    ttsKey: process.env.NEXT_PUBLIC_GOOGLE_TTS_KEY,
  },
  jamendo: {
    clientId: JAMENDO_CLIENT_ID,
  }
}
