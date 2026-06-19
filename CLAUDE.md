1. Contexte du projet

Naturia est une migration de NutriCore v9 (HTML vanilla monolithique) vers une plateforme SaaS React/Next.js pour thérapeutes en santé naturelle (naturopathes, nutritionnistes, etc.).

Règle absolue — NutriCore est en lecture seule


NutriCore_v9.html est la référence métier. C'est la source de vérité pour la logique fonctionnelle, les données, les comportements attendus.
On ne modifie jamais NutriCore. Zéro exception.
Quand un comportement est ambigu dans naturia, aller lire NutriCore pour comprendre ce qui doit se passer.
Contexte du projet

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




2. Stack technique de naturia

CoucheTechnologieFrameworkNext.js 16 (App Router), React 19, TypeScriptUITailwind CSS 4, Radix UI, lucide-reactAuth / DBSupabase (@supabase/supabase-js, @supabase/ssr)MédiasCloudinary, UploadThingMonitoringSentry (@sentry/nextjs)TestsPlaywright (E2E)DéploiementCloudflare Pages (Wrangler) + Vercel

⚠️ Avertissement critique sur Next.js
