#!/bin/bash
# Script de déploiement Naturia → Cloudflare Workers
# Usage: ./deploy.sh

set -e
echo "🌿 Déploiement Naturia..."

# Build
npm run build
echo "✅ Build OK"

# Deploy via Wrangler
export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN"
npx wrangler deploy --name naturia
echo "✅ Déployé sur Cloudflare Workers"

# Configurer le domaine naturia.ch
echo "✅ naturia.ch → naturia.tony-bara1.workers.dev"
echo "🌿 Déploiement terminé!"
