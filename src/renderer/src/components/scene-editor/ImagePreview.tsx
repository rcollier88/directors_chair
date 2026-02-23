import { useState, useEffect } from 'react'
import type { Asset } from '../../../../shared/types'

interface ImagePreviewProps {
  projectDir: string
  sceneId: string
  asset: Asset
  onClose: () => void
}

export function ImagePreview({
  projectDir,
  sceneId,
  asset,
  onClose
}: ImagePreviewProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const loadImage = async (): Promise<void> => {
      try {
        const path = await window.api.getAssetPath(projectDir, 'asset', sceneId, asset.filename)
        setImageUrl('dc-asset:///' + path.replace(/\\/g, '/'))
      } catch {
        setImageUrl(null)
      }
    }
    loadImage()
  }, [projectDir, sceneId, asset.filename])

  const handleReveal = (): void => {
    window.api.revealAsset(projectDir, sceneId, asset.filename)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={asset.filename}
            className="max-h-[85vh] max-w-[85vw] rounded object-contain"
          />
        ) : (
          <div className="flex h-64 w-96 items-center justify-center rounded bg-gray-800 text-gray-400">
            Loading...
          </div>
        )}

        {/* Bottom bar */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-400">{asset.filename}</span>
          <div className="flex gap-2">
            <button
              onClick={handleReveal}
              className="rounded bg-gray-700 px-3 py-1 text-xs text-gray-300 hover:bg-gray-600"
            >
              Reveal in Explorer
            </button>
            <button
              onClick={onClose}
              className="rounded bg-gray-700 px-3 py-1 text-xs text-gray-300 hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
