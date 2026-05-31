// Configuration Uptime Robot pour Naturia
// Surveille le site toutes les 5 minutes

export const MONITORS = [
  {
    friendly_name: "Naturia — Page principale",
    url: "https://naturia.ch",
    type: 1, // HTTP
    interval: 300, // 5 minutes
  },
  {
    friendly_name: "Naturia — API Supabase",
    url: "https://thzexgjugfruzzgzhefx.supabase.co/rest/v1/",
    type: 1,
    interval: 300,
  }
]

export async function setupMonitoring(apiKey: string) {
  for (const monitor of MONITORS) {
    const response = await fetch('https://api.uptimerobot.com/v2/newMonitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, ...monitor })
    })
    const data = await response.json()
    console.log(`Monitor créé: ${monitor.friendly_name}`, data.stat)
  }
}
