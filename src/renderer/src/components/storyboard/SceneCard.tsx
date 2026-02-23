import { useState, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useProjectStore } from '../../stores/project-store'
import type { Scene } from '../../../../shared/types'

interface SceneCardProps {
  scene: Scene
}

export function SceneCard({ scene }: SceneCardProps): JSX.Element {
  const { selectedSceneId, projectPath, selectScene, deleteScene, duplicateScene } =
    useProjectStore()
  const isSelected = selectedSceneId === scene.id
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: scene.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  // Load thumbnail for the first image asset
  const firstImage = scene.assets.find((a) => a.type === 'image')
  useEffect(() => {
    if (!firstImage || !projectPath) {
      setThumbnailUrl(null)
      return
    }
    const load = async (): Promise<void> => {
      try {
        const path = firstImage.thumbnailPath
          ? await window.api.getAssetPath(projectPath, 'thumbnail', scene.id, firstImage.thumbnailPath)
          : await window.api.getAssetPath(projectPath, 'asset', scene.id, firstImage.filename)
        setThumbnailUrl('dc-asset:///' + path.replace(/\\/g, '/'))
      } catch {
        setThumbnailUrl(null)
      }
    }
    load()
  }, [firstImage?.id, firstImage?.thumbnailPath, scene.id, projectPath])

  const handleClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
    selectScene(scene.id)
  }

  const handleDelete = (e: React.MouseEvent): void => {
    e.stopPropagation()
    deleteScene(scene.id)
  }

  const handleDuplicate = (e: React.MouseEvent): void => {
    e.stopPropagation()
    duplicateScene(scene.id)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`group relative cursor-pointer rounded-lg border-2 bg-gray-800 transition-colors ${
        isSelected ? 'border-blue-500' : 'border-gray-700 hover:border-gray-500'
      }`}
    >
      {/* Thumbnail area */}
      <div className="flex h-28 items-center justify-center overflow-hidden rounded-t-md bg-gray-700/50">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={scene.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-2xl text-gray-600">{scene.order + 1}</span>
        )}
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="truncate text-sm font-medium text-white">{scene.title}</p>
        {scene.description && (
          <p className="mt-0.5 truncate text-xs text-gray-400">{scene.description}</p>
        )}
        <div className="mt-1.5 flex items-center gap-1.5">
          <span
            className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${
              scene.status === 'approved'
                ? 'bg-green-900/50 text-green-400'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {scene.status}
          </span>
          {scene.assets.length > 0 && (
            <span className="text-[10px] text-gray-500">
              {scene.assets.length} asset{scene.assets.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons — visible on hover */}
      <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={handleDuplicate}
          title="Duplicate"
          className="rounded bg-gray-800/80 px-1.5 py-0.5 text-[10px] text-gray-300 hover:bg-gray-700"
        >
          dup
        </button>
        <button
          onClick={handleDelete}
          title="Delete"
          className="rounded bg-gray-800/80 px-1.5 py-0.5 text-[10px] text-red-400 hover:bg-red-900/50"
        >
          del
        </button>
      </div>
    </div>
  )
}
