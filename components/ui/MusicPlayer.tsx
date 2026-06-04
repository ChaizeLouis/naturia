'use client'

import { useState, useEffect, useRef } from 'react'
import { getMusiqueAmbiance, type SpecialiteThérapeute } from '@/lib/media'

interface MusicPlayerProps {
  specialite: SpecialiteThérapeute
  autoPlay?: boolean
  compact?: boolean
}

export default function MusicPlayer({ specialite, autoPlay = false, compact = false }: MusicPlayerProps) {
  const [tracks, setTracks] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [loading, setLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    getMusiqueAmbiance(specialite, 5).then(t => {
      setTracks(t)
      setLoading(false)
    })
  }, [specialite])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current || tracks.length === 0) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }

  const track = tracks[current]

  if (loading) return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" />
      Chargement musique...
    </div>
  )

  if (!track || tracks.length === 0) return null

  if (compact) return (
    <div className="flex items-center gap-2">
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
        title="Musique d'ambiance"
      >
        {playing ? '⏸' : '🎵'}
      </button>
      <span className="text-xs text-gray-400 truncate max-w-24">
        {track.name}
      </span>
      <audio
        ref={audioRef}
        src={track.audio}
        loop
        onEnded={() => setCurrent(c => (c + 1) % tracks.length)}
      />
    </div>
  )

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-green-700">🎵 Ambiance musicale</p>
          <p className="text-xs text-gray-500 truncate max-w-48">{track.name}</p>
          <p className="text-xs text-gray-400">{track.artist_name}</p>
        </div>
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors shadow-sm"
        >
          {playing ? '⏸' : '▶'}
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">🔈</span>
        <input
          type="range" min="0" max="1" step="0.05"
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          className="flex-1 h-1 accent-green-500"
        />
        <span className="text-xs text-gray-400">🔊</span>
      </div>

      <audio
        ref={audioRef}
        src={track.audio}
        loop={false}
        onEnded={() => {
          const next = (current + 1) % tracks.length
          setCurrent(next)
        }}
        autoPlay={autoPlay}
      />
    </div>
  )
}
