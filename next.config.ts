import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pas d'export statique pour Vercel - il gère ça nativement
  images: { unoptimized: true },
  // Variables d'environnement publiques
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://thzexgjugfruzzgzhefx.supabase.co',
  }
};

export default nextConfig;
