import { useState, useEffect, useCallback } from 'react'
import { useProjectStore } from '../../stores/project-store'
import { ImagePreview } from './ImagePreview'
import type { Scene, Asset } from '../../../../shared/types'

interface AssetGalleryProps {
  scene: Scene
}

export function AssetGallery({ scene }: AssetGalleryProps): JSX.Element {
  const { projectPath, updateScene } = useProjectStore()
  const [isImporting, setIsImporting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null)
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({})

  // Load thumbnail URLs for all image assets
  useEffect(() => {
    if (!projectPath) return

    const loadThumbnails = async (): Promise<void> => {
      const urls: Record<string, string> = {}
      for (const asset of scene.assets) {
        if (asset.type === 'image') {
          try {
            const path = asset.thumbnailPath
              ? await window.api.getAssetPath(projectPath, 'thumbnail', scene.id, asset.thumbnailPath)
              : await window.api.getAssetPath(projectPath, 'asset', scene.id, asset.filename)
            // Use custom protocol to serve local files (works in dev + production)
            urls[asset.id] = 'dc-asset:///' + path.replace(/\\/g, '/')
          } catch {
            // skip
          }
        }
      }
      setThumbnailUrls(urls)
    }
    loadThumbnails()
  }, [scene.assets, scene.id, projectPath])

  const handleImport = async (): Promise<void> => {
    if (!projectPath) return
    setIsImporting(true)
    try {
      const filePaths = await window.api.pickFiles()
      if (filePaths.length === 0) return

      const newAssets = await window.api.importAssets(projectPath, scene.id, filePaths)
      updateScene(scene.id, { assets: [...scene.assets, ...newAssets] })
    } catch (err) {
      console.error('Failed to import assets:', err)
    } finally {
      setIsImporting(false)
    }
  }

  const handleDrop = useCallback(
    async (e: React.DragEvent): Promise<void> => {
      e.preventDefault()
      setIsDragOver(false)
      if (!projectPath) return

      const files = Array.from(e.dataTransfer.files)
      if (files.length === 0) return

      setIsImporting(true)
      try {
        const filePaths = files
          .map((f) => window.api.getPathForFile(f))
          .filter((p): p is string => !!p)
        if (filePaths.length === 0) return
        const newAssets = await window.api.importAssets(projectPath, scene.id, filePaths)
        updateScene(scene.id, { assets: [...scene.assets, ...newAssets] })
      } catch (err) {
        console.error('Failed to import dropped files:', err)
      } finally {
        setIsImporting(false)
      }
    },
    [projectPath, scene.id, scene.assets, updateScene]
  )

  const handleDeleteAsset = async (asset: Asset): Promise<void> => {
    if (!projectPath) return
    try {
      await window.api.deleteAsset(projectPath, scene.id, asset)
      updateScene(scene.id, { assets: scene.assets.filter((a) => a.id !== asset.id) })
    } catch (err) {
      console.error('Failed to delete asset:', err)
    }
  }

  const handleRevealAsset = (asset: Asset): void => {
    if (!projectPath) return
    window.api.revealAsset(projectPath, scene.id, asset.filename)
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-400">
        Assets ({scene.assets.length})
      </label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`rounded border-2 border-dashed p-2 transition-colors ${
          isDragOver ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700'
        }`}
      >
        {scene.assets.length > 0 ? (
          <div className="grid grid-cols-3 gap-1.5">
            {scene.assets.map((asset) => (
              <div key={asset.id} className="group relative">
                {asset.type === 'image' && thumbnailUrls[asset.id] ? (
                  <img
                    src={thumbnailUrls[asset.id]}
                    alt={asset.filename}
                    onClick={() => setPreviewAsset(asset)}
                    className="h-16 w-full cursor-pointer rounded object-cover"
                  />
                ) : (
                  <div
                    onClick={() => setPreviewAsset(asset)}
                    className="flex h-16 cursor-pointer items-center justify-center rounded bg-gray-700 text-[10px] text-gray-400"
                  >
                    {asset.filename.split('.').pop()?.toUpperCase()}
                  </div>
                )}
                {/* Hover actions */}
                <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 rounded-b bg-black/70 py-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleRevealAsset(asset)}
                    title="Reveal in Explorer"
                    className="text-[9px] text-gray-300 hover:text-white"
                  >
                    folder
                  </button>
                  <button
                    onClick={() => handleDeleteAsset(asset)}
                    title="Delete"
                    className="text-[9px] text-red-400 hover:text-red-300"
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-2 text-center text-[10px] text-gray-500">
            Drop images here or click Import
          </p>
        )}
      </div>

      {/* Import button */}
      <button
        onClick={handleImport}
        disabled={isImporting}
        className="mt-1.5 w-full rounded bg-gray-700 py-1.5 text-xs text-gray-300 hover:bg-gray-600 disabled:opacity-50"
      >
        {isImporting ? 'Importing...' : 'Import Images'}
      </button>

      {/* Preview modal */}
      {previewAsset && projectPath && (
        <ImagePreview
          projectDir={projectPath}
          sceneId={scene.id}
          asset={previewAsset}
          onClose={() => setPreviewAsset(null)}
        />
      )}
    </div>
  )
}
