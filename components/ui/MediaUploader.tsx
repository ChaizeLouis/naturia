'use client'

import { useState, useRef } from 'react'
import { uploadPhotoThérapeute, uploadVidéoThérapeute } from '@/lib/media'

interface MediaUploaderProps {
  type: 'photo' | 'video' | 'both'
  onUpload: (result: { url: string; type: 'photo' | 'video' }) => void
  label?: string
}

export default function MediaUploader({ type, onUpload, label }: MediaUploaderProps) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const accept = type === 'photo' 
    ? 'image/*' 
    : type === 'video' 
    ? 'video/*' 
    : 'image/*,video/*'

  const handleFile = async (file: File) => {
    setLoading(true)
    setError(null)
    
    // Prévisualisation locale
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    try {
      const isVideo = file.type.startsWith('video/')
      
      if (isVideo) {
        const result = await uploadVidéoThérapeute(file)
        if (result) {
          onUpload({ url: result.url, type: 'video' })
        }
      } else {
        const result = await uploadPhotoThérapeute(file)
        if (result) {
          onUpload({ url: result.urlOptimisée, type: 'photo' })
        }
      }
    } catch {
      setError('Erreur lors de l\'upload. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="w-full">
      {label && (
        <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      )}
      
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
      >
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Upload en cours...</p>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center gap-2">
            {preview.startsWith('blob:') && (
              <img src={preview} alt="Aperçu" className="w-24 h-24 object-cover rounded-lg" />
            )}
            <p className="text-sm text-green-600 font-medium">✅ Fichier uploadé</p>
            <p className="text-xs text-gray-400">Cliquer pour changer</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl">
              {type === 'photo' ? '📸' : type === 'video' ? '🎬' : '📁'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Glisser-déposer ou cliquer
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {type === 'photo' ? 'JPG, PNG, WEBP — Max 10MB' 
                : type === 'video' ? 'MP4, MOV, WEBM — Max 100MB'
                : 'Photos et vidéos acceptées'}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}
