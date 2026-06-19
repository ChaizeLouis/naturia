# Structure du projet Naturia

Application Next.js (App Router) pour la gestion d'une pratique de naturopathie : patients, consultations, agenda, facturation, suppléments, chat et support.

## Arborescence

```
naturia/
├── .github/
│   └── workflows/
│       ├── deploy-and-test.yml
│       ├── monitor.yml
│       └── test.yml
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AuthPage.tsx
│   ├── Dashboard.tsx
│   ├── SplashPage.tsx
│   ├── layout/
│   │   └── Sidebar.tsx
│   ├── ui/
│   │   ├── MediaUploader.tsx
│   │   ├── MusicPlayer.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   └── views/
│       ├── AgendaView.tsx
│       ├── ChatView.tsx
│       ├── ConsultationsView.tsx
│       ├── DashboardView.tsx
│       ├── FacturationView.tsx
│       ├── PatientsView.tsx
│       ├── SupplementsView.tsx
│       └── SupportView.tsx
├── lib/
│   ├── config.ts
│   ├── error-handler.ts
│   ├── hors-cdc.ts
│   ├── media.ts
│   ├── monitoring.ts
│   ├── supabase.ts
│   └── utils.ts
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── tests/
│   └── naturia.spec.ts
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── deploy.sh
├── eslint.config.mjs
├── instrumentation.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── playwright.config.ts
├── postcss.config.mjs
├── sentry.client.config.ts
├── sentry.edge.config.ts
├── test-naturia.sh
├── tsconfig.json
├── vercel.json
└── wrangler.toml
```

## Rôle de chaque dossier

- **`.github/workflows/`** — Pipelines CI/CD : déploiement + tests, monitoring, tests automatisés.
- **`app/`** — Point d'entrée Next.js App Router (layout global, page racine, styles globaux).
- **`components/`** — Composants React de l'application (pages principales, layout, UI génériques, vues métier).
- **`components/layout/`** — Composants structurants de mise en page (ex. barre latérale de navigation).
- **`components/ui/`** — Composants UI réutilisables et génériques (boutons, cartes, inputs, uploader média, lecteur audio).
- **`components/views/`** — Vues métier correspondant à chaque section de l'app (agenda, chat, consultations, facturation, patients, suppléments, support, dashboard).
- **`lib/`** — Logique partagée : configuration, gestion d'erreurs, monitoring, accès Supabase, utilitaires, logique métier "hors-cdc".
- **`public/`** — Fichiers statiques servis tels quels (icônes SVG, favicon-like assets).
- **`tests/`** — Tests end-to-end Playwright.

## Fichiers clés à connaître

| Fichier | Rôle |
|---|---|
| `app/page.tsx` | Page racine de l'application. |
| `app/layout.tsx` | Layout global Next.js (polices, structure HTML commune). |
| `components/Dashboard.tsx` | Composant conteneur principal après authentification. |
| `components/AuthPage.tsx` | Écran d'authentification. |
| `components/layout/Sidebar.tsx` | Navigation principale entre les vues. |
| `lib/supabase.ts` | Client et configuration Supabase (backend/BDD/auth). |
| `lib/config.ts` | Configuration globale de l'application. |
| `lib/error-handler.ts` | Gestion centralisée des erreurs. |
| `lib/monitoring.ts` | Intégration monitoring (lié à Sentry). |
| `sentry.client.config.ts` / `sentry.edge.config.ts` | Configuration Sentry côté client et edge. |
| `instrumentation.ts` | Hook d'instrumentation Next.js (init monitoring au démarrage). |
| `next.config.ts` | Configuration Next.js (notez : version avec breaking changes, voir `AGENTS.md`). |
| `AGENTS.md` | ⚠️ Avertit que cette version de Next.js diffère du Next.js standard — à lire avant de coder. |
| `package.json` | Dépendances et scripts (`dev`, `build`, `deploy`, `test`). |
| `playwright.config.ts` / `tests/naturia.spec.ts` | Configuration et tests end-to-end. |
| `deploy.sh` / `wrangler.toml` / `vercel.json` | Scripts et configuration de déploiement (Cloudflare Pages via Wrangler, Vercel). |
| `tsconfig.json` | Configuration TypeScript. |

## Stack technique

- **Framework** : Next.js 16 (App Router), React 19, TypeScript.
- **UI** : Radix UI, Tailwind CSS 4, lucide-react.
- **Backend/Auth/DB** : Supabase (`@supabase/supabase-js`, `@supabase/ssr`).
- **Médias** : Cloudinary, UploadThing.
- **Monitoring** : Sentry (`@sentry/nextjs`).
- **Tests** : Playwright.
- **Déploiement** : Cloudflare Pages (Wrangler) et/ou Vercel.
