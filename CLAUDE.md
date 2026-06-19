# CLAUDE.md — Projet Naturia

> Lis ce fichier en entier avant d'écrire la moindre ligne de code.

---

## 1. Contexte du projet

**Naturia** est une migration de **NutriCore v9** (HTML vanilla monolithique) vers une plateforme SaaS React/Next.js pour thérapeutes en santé naturelle (naturopathes, nutritionnistes, etc.).

### Règle absolue — NutriCore est en lecture seule

- `NutriCore_v9.html` est la **référence métier**. C'est la source de vérité pour la logique fonctionnelle, les données, les comportements attendus.
- **On ne modifie jamais NutriCore.** Zéro exception.
- Quand un comportement est ambigu dans naturia, aller lire NutriCore pour comprendre ce qui doit se passer.

---

## 2. Stack technique de naturia

| Couche | Technologie |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, Radix UI, lucide-react |
| Auth / DB | Supabase (`@supabase/supabase-js`, `@supabase/ssr`) |
| Médias | Cloudinary, UploadThing |
| Monitoring | Sentry (`@sentry/nextjs`) |
| Tests | Playwright (E2E) |
| Déploiement | Cloudflare Pages (Wrangler) + Vercel |

### ⚠️ Avertissement critique sur Next.js

Ce projet utilise **Next.js 16** qui contient des breaking changes par rapport au Next.js standard documenté en ligne. **Lire `AGENTS.md` avant d'écrire du code** qui touche la config Next ou les patterns App Router. Ne pas supposer que la doc en ligne correspond à cette version.

---

## 3. Architecture — Décisions non négociables

Ces décisions sont prises. On ne les remet pas en question, on ne propose pas d'alternatives.

### Structure des composants

```
components/
  AuthPage.tsx          — écran d'authentification
  Dashboard.tsx         — conteneur principal post-auth
  SplashPage.tsx        — page de bienvenue
  layout/
    Sidebar.tsx         — navigation principale entre vues
  ui/                   — composants réutilisables (button, card, badge, input…)
  views/                — une vue = un fichier = une section de l'app
    DashboardView.tsx
    PatientsView.tsx
    ConsultationsView.tsx
    AgendaView.tsx
    FacturationView.tsx
    SupplementsView.tsx
    ChatView.tsx
    SupportView.tsx
```

### Règles d'architecture

- **Toute la logique métier reste dans `lib/`**. Les composants views ne font que de la présentation + appels aux fonctions lib.
- **Supabase est le seul backend**. Pas de routes API Next.js pour les données métier — on appelle Supabase directement depuis les composants client.
- **`lib/supabase.ts`** est le seul point d'entrée Supabase. On n'instancie pas le client ailleurs.
- **Une vue = un fichier dans `components/views/`**. On ne crée pas de sous-dossiers par vue.
- **`lib/config.ts`** centralise toutes les constantes de configuration. On n'écrit pas de valeurs en dur dans les composants.
- **`lib/error-handler.ts`** gère les erreurs. On ne fait pas de `console.error` direct dans les composants.
- **`lib/monitoring.ts`** + Sentry gèrent le monitoring. On n'ajoute pas d'autre outil de tracking.

---

## 4. Données métier de NutriCore — Ce qu'il faut migrer

### Schéma Supabase (déduit de NutriCore v9)

**Table `patients`**
- `id`, `therapist_id` (FK → auth.users)
- `prenom`, `nom`, `email`, `telephone`
- `date_naissance`, `sexe`
- `profil` : `general | sportif | femme_enceinte | seniorite | pediatrie | vegetarien | vegane`
- `notes` (antécédents, allergies, traitements)
- `created_at`, `updated_at`

**Table `consultations`**
- `id`, `therapist_id`, `patient_id` (FK → patients)
- `type_consultation` : `Bilan initial | Suivi mensuel | Suivi trimestriel | Urgence | Téléconsultation`
- `titre`, `motif`, `antecedents`, `medicaments`, `allergies`, `objectifs`
- `bilan` (JSONB) : `{ score: number, symptomes: string[], patterns_detectes: string[] }`
- `protocole` (JSONB array) : liste de suppléments prescrits `[{ id, nom, dose, timing }]`
- `alimentation` (JSONB) : fréquences, comportements, régimes
- `notes` (notes cliniques libres)
- `created_at`

**Table `agenda`**
- `id`, `therapist_id`, `patient_id` (nullable)
- `titre`, `date_rdv` (ISO), `duree_minutes` (défaut : 60)
- `notes`
- `created_at`

**Table `therapists`** (profil du thérapeute)
- `id` (FK → auth.users), `prenom`, `nom`, `email`
- `cabinet`, `specialite`
- `created_at`

### Données statiques (embarquées dans NutriCore — à garder côté client)

- **315 suppléments** (`SUPPLEMENTS[]`) : id, nom, catégorie, sous-catégorie, dose, timing, biodisponibilité, indications, contre-indications, synergies, PMID, niveau de preuve, finding, labo.
- **8 patterns symptomatiques** (`PATTERNS[]`) pour la détection de carences : anémie, thyroïde, épuisement surrénalien, inflammation chronique, dysbiose, troubles du sommeil, carence vitamine D, stress oxydatif.
- **Aliments** (`ALIMENTS[]`) : valeurs nutritionnelles (cal, prot, lip, glu), bénéfices, contre-indications.

Ces données **ne vont pas en base Supabase** — elles restent des constantes TypeScript dans `lib/`.

---

## 5. Ordre d'implémentation des vues

Respecter cet ordre. Ne pas travailler sur une vue sans avoir complété et validé la précédente.

### Vue 1 — Patients (priorité absolue)

**Ce que NutriCore fait :**
- Liste des patients avec search (filtre sur nom, prénom, email)
- Avatar initiales, affichage email + téléphone + profil clinique
- Modale création / édition : prénom*, nom*, email, téléphone, date naissance, sexe, profil clinique, notes
- Validation : prénom et nom requis
- Delete avec confirmation
- CRUD complet via Supabase (`patients` table)
- State local mis à jour sans rechargement (optimistic ou post-refetch)

**Erreurs à traduire :**
```
'Invalid login credentials' → 'Email ou mot de passe incorrect.'
'User already registered' → 'Un compte existe déjà avec cet email.'
'Database error' → 'Erreur serveur. Réessayez.'
```

---

### Vue 2 — Consultations

**Ce que NutriCore fait :**
- Liste des consultations (patient, type, score bilan, nb suppléments protocole, date)
- Modale création (grande — `modal-lg`) avec 5 sections :
  1. **Identification** : patient, type consultation, profil, titre
  2. **Anamnèse** : motif, antécédents, médicaments, allergies, objectifs
  3. **Bilan symptomatique** : 8 patterns × N symptômes à cocher → score dynamique (%) + détection automatique des carences prioritaires si ≥ seuil de symptômes cochés par pattern
  4. **Protocole supplémentaire** : recherche dans les 315 suppléments + ajout au protocole avec dose/timing
  5. **Notes cliniques** libres
- CRUD via Supabase (`consultations` table)

**Logique clé à respecter :**
- Le score = `(total symptômes cochés / total symptômes possibles) × 100`
- Un pattern est "détecté" si le nombre de symptômes cochés ≥ `pattern.seuil`
- Les carences suggérées viennent directement de `pattern.carences[]`
- La recherche de suppléments dans la modale filtre sur `nom` + `indications` (min 2 caractères, max 6 résultats affichés)

---

### Vue 3 — Agenda

**Ce que NutriCore fait :**
- Affichage chronologique des RDV groupés par date (format `lundi 14 juin`)
- Bouton "Nouveau RDV"
- Modale création : titre*, patient (optionnel), date+heure*, durée (défaut 60 min, pas de 15 min), notes
- Delete avec confirmation
- Affichage : heure (accent), titre, patient + durée

---

### Vue 4 — Facturation

**Ce que NutriCore fait :**
- Affichage du plan actif (49 CHF/mois/thérapeute)
- Liste des features incluses
- Statut abonnement (badge "Actif")
- Informations : date création compte, prochaine facturation, montant, mode de paiement, version
- Contact support pour configuration paiement

**Note importante :** Dans NutriCore, cette vue est purement informative (pas de paiement Stripe intégré). Naturia peut évoluer vers Stripe, mais la vue de base reproduit le comportement de NutriCore.

---

### Vue 5 — Suppléments

**Ce que NutriCore fait :**
- Grille auto-fill de cards (minmax 250px)
- Search : filtre sur `nom + indications + catégorie`
- Filtres par catégorie (pills) : Tous, Vitamines, Minéraux, Oméga, Acides aminés, Adaptogènes, Probiotiques, Plantes, Antioxydants, Cognitif, Sport, Digestif, Hormonal, Immunité, Stress, Cardio
- Badge niveau de preuve : L1 = vert (méta-analyse), L2 = bleu (ECR), L3 = jaune (revues)
- Limite d'affichage à 60 résultats avec message "N suppléments supplémentaires — affinez votre recherche"
- Modale détail (large) avec 2 colonnes : niveau preuve + finding + dosage + biodisponibilité | indications + contre-indications + synergies + liens PMID

---

## 6. Ce qui existe déjà dans naturia

Les fichiers suivants sont en place — **ne pas les recréer, ne pas les restructurer** :

- `app/layout.tsx` — layout global Next.js
- `app/page.tsx` — page racine
- `app/globals.css` — styles globaux
- `components/AuthPage.tsx` — authentification
- `components/Dashboard.tsx` — conteneur principal
- `components/SplashPage.tsx` — splash screen
- `components/layout/Sidebar.tsx` — navigation
- `components/ui/` — button, card, badge, input, MediaUploader, MusicPlayer
- `components/views/` — tous les fichiers de vues existent (certains sont vides ou partiels)
- `lib/supabase.ts` — client Supabase configuré
- `lib/config.ts` — configuration globale
- `lib/error-handler.ts` — gestion d'erreurs centralisée
- `lib/monitoring.ts` — Sentry
- `lib/utils.ts` — utilitaires
- `sentry.client.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts` — monitoring configuré
- `tests/naturia.spec.ts` — tests Playwright

---

## 7. Problèmes critiques à régler avant tout développement

### 7.1 Clés API exposées dans NutriCore

NutriCore v9 contient des clés API en clair dans le HTML (Supabase anon key, OpenRouter key). Ces clés **ne doivent pas** être copiées-collées dans naturia comme constantes.

Dans naturia :
- **Supabase** : les clés vont dans `.env.local` → `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **OpenRouter** (pour Chat Nova/ARIA) : la clé va dans `.env.local` → `OPENROUTER_API_KEY` (sans préfixe `NEXT_PUBLIC_` — elle s'utilise côté serveur uniquement)
- **Cloudinary, UploadThing, Sentry** : idem, variables d'environnement uniquement

**Ne jamais écrire une clé API dans un fichier `.ts` ou `.tsx`.**

### 7.2 Vérifier `.env.local` avant de démarrer

Si les variables d'environnement ne sont pas configurées, l'app ne peut pas fonctionner. Vérifier que ces variables existent avant de debugger quoi que ce soit :

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
NEXT_PUBLIC_SENTRY_DSN=
```

---

## 8. Ce que Claude ne doit PAS faire

- **Modifier `NutriCore_v9.html`** — jamais, sous aucun prétexte
- **Créer de nouvelles routes `app/` pour le routing des vues** — la navigation entre vues se fait via state dans `Dashboard.tsx`, pas via le router Next.js (c'est une SPA côté client, pas une MPA)
- **Ajouter une nouvelle bibliothèque UI** sans raison — Radix UI + Tailwind sont déjà là
- **Créer un fichier `lib/supabase.ts` dupliqué** ou instancier Supabase ailleurs que dans `lib/supabase.ts`
- **Proposer Redux, Zustand ou un state manager externe** — le state se gère avec React useState/useContext dans `Dashboard.tsx`
- **Écrire des clés API en dur** dans le code
- **Restructurer le dossier `components/`** — l'arborescence est figée
- **Sauter l'ordre d'implémentation des vues** — on fait Patients → Consultations → Agenda → Facturation → Suppléments
- **Inventer des comportements** non présents dans NutriCore sans validation explicite
- **Utiliser `any` en TypeScript** sans raison documentée
- **Créer des fichiers CSS séparés** — tout le styling passe par Tailwind ou `globals.css`
- **Proposer de passer en SSR/SSG** les vues métier — elles sont client-side (`'use client'`)

---

## 9. Conventions de code observées dans naturia

### TypeScript

```typescript
// Interfaces pour les entités métier
interface Patient {
  id: string
  therapist_id: string
  prenom: string
  nom: string
  email?: string
  telephone?: string
  date_naissance?: string
  sexe?: string
  profil: 'general' | 'sportif' | 'femme_enceinte' | 'seniorite' | 'pediatrie' | 'vegetarien' | 'vegane'
  notes?: string
  created_at: string
  updated_at?: string
}
```

### Composants React

```typescript
// Toujours 'use client' pour les vues métier
'use client'

import { useState } from 'react'

// Props typées
interface PatientsViewProps {
  patients: Patient[]
  onPatientAdded: (patient: Patient) => void
  onPatientUpdated: (patient: Patient) => void
  onPatientDeleted: (id: string) => void
}

export function PatientsView({ patients, onPatientAdded, onPatientUpdated, onPatientDeleted }: PatientsViewProps) {
  // ...
}
```

### Appels Supabase

```typescript
// Pattern standard — toujours destructurer { data, error }
const { data, error } = await supabase
  .from('patients')
  .select('*')
  .eq('therapist_id', userId)
  .order('created_at', { ascending: false })

if (error) {
  // Passer par lib/error-handler.ts
  handleError(error)
  return
}
```

### Gestion d'erreurs

```typescript
// Utiliser lib/error-handler.ts — ne pas faire de try/catch custom
import { handleError, translateError } from '@/lib/error-handler'
```

### Nommage

- Composants : PascalCase (`PatientsView`, `PatientModal`)
- Fonctions utilitaires : camelCase (`savePatient`, `deleteRdv`)
- Constantes métier : SCREAMING_SNAKE_CASE (`SUPPLEMENTS`, `PATTERNS`)
- Variables d'état : camelCase avec préfixe descriptif (`isLoading`, `searchQuery`, `selectedPatient`)
- Fichiers composants : PascalCase.tsx
- Fichiers lib : kebab-case.ts

### Tailwind

- Utiliser les classes Tailwind pour tout le styling
- Pas de `style={{}}` inline sauf pour des valeurs dynamiques calculées (ex: largeur d'une barre de progression)
- Respecter le thème sombre existant (fond `bg-gray-900`, accents verts)

---

## 10. Tarif et constantes métier

Extraits de NutriCore à reproduire fidèlement dans `lib/config.ts` :

```typescript
export const TARIF_CHF = 49
export const NC_VERSION = '9.0' // ou version naturia
export const SUPPLEMENT_DISPLAY_LIMIT = 60
export const SUPPLEMENT_SEARCH_MIN_CHARS = 2
export const SUPPLEMENT_MODAL_MAX_RESULTS = 6
export const DEFAULT_RDV_DUREE_MINUTES = 60
export const RDV_DUREE_STEP_MINUTES = 15
export const CONSULTATION_TYPES = ['Bilan initial', 'Suivi mensuel', 'Suivi trimestriel', 'Urgence', 'Téléconsultation'] as const
export const PATIENT_PROFILS = ['general', 'sportif', 'femme_enceinte', 'seniorite', 'pediatrie', 'vegetarien', 'vegane'] as const
```

---

## 11. Design system — Couleurs de référence (NutriCore → Tailwind)

| Variable NutriCore | Valeur hex | Équivalent Tailwind |
|---|---|---|
| `--accent` | `#3fb68b` | `emerald-500` (approximatif) |
| `--accent2` | `#2ea373` | `emerald-600` |
| `--bg` | `#0d1117` | `gray-950` |
| `--bg2` | `#161b22` | `gray-900` |
| `--bg3` | `#1c2330` | `gray-800` |
| `--border` | `#30363d` | `gray-700` |
| `--text` | `#e6edf3` | `gray-100` |
| `--text2` | `#8b949e` | `gray-400` |
| `--danger` | `#f85149` | `red-500` |
| `--warning` | `#d29922` | `yellow-600` |
| `--info` | `#58a6ff` | `blue-400` |

---

## 12. Points d'attention supplémentaires

### Sécurité Row Level Security (RLS) Supabase

Chaque table doit avoir des policies RLS qui vérifient que `therapist_id = auth.uid()`. Sans ça, un thérapeute peut lire les données d'un autre. NutriCore n'avait pas ce problème (monoutilisateur local), mais naturia est multi-tenant.

### RGPD

Les données patients sont des données de santé (article 9 RGPD). L'hébergement est en Europe (Supabase EU — Paris). Ne pas logger les données patients dans Sentry ou tout autre outil externe.

### Chat NOVA / ARIA

Dans NutriCore, le chat utilise OpenRouter avec `meta-llama/llama-3.3-70b-instruct:free`. Dans naturia, cet appel doit passer par une **route API Next.js** (pas d'appel direct depuis le client) pour cacher la clé OpenRouter. Ce n'est pas encore implémenté — à faire après les 5 vues prioritaires.

### Tests Playwright

Avant de soumettre une vue comme "terminée", s'assurer que `tests/naturia.spec.ts` couvre les happy paths de cette vue. Lancer `npm run test` pour vérifier.
