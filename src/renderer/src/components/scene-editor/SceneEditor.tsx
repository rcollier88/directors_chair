import { useState, useEffect } from 'react'
import { useProjectStore } from '../../stores/project-store'
import type { Scene } from '../../../../shared/types'

interface SceneEditorProps {
  scene: Scene
}

export function SceneEditor({ scene }: SceneEditorProps): JSX.Element {
  const { updateScene, deleteScene, duplicateScene, selectScene } = useProjectStore()

  // Local state for text fields (debounced save)
  const [title, setTitle] = useState(scene.title)
  const [description, setDescription] = useState(scene.description)
  const [cameraNote, setCameraNote] = useState(scene.cameraNote)
  const [dialogueNote, setDialogueNote] = useState(scene.dialogueNote)
  const [tagInput, setTagInput] = useState('')

  // Sync local state when selected scene changes
  useEffect(() => {
    setTitle(scene.title)
    setDescription(scene.description)
    setCameraNote(scene.cameraNote)
    setDialogueNote(scene.dialogueNote)
    setTagInput('')
  }, [scene.id])

  // Debounced save on blur
  const handleBlur = (field: string, value: string): void => {
    updateScene(scene.id, { [field]: value })
  }

  const handleStatusToggle = (): void => {
    updateScene(scene.id, {
      status: scene.status === 'draft' ? 'approved' : 'draft'
    })
  }

  const handleAddTag = (): void => {
    const tag = tagInput.trim()
    if (tag && !scene.tags.includes(tag)) {
      updateScene(scene.id, { tags: [...scene.tags, tag] })
    }
    setTagInput('')
  }

  const handleRemoveTag = (tag: string): void => {
    updateScene(scene.id, { tags: scene.tags.filter((t) => t !== tag) })
  }

  const handleDelete = (): void => {
    deleteScene(scene.id)
  }

  const handleDuplicate = (): void => {
    duplicateScene(scene.id)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-850 bg-gray-800/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 px-4 py-2">
        <span className="text-xs font-medium text-gray-400">Scene #{scene.order + 1}</span>
        <button
          onClick={() => selectScene(null)}
          className="text-xs text-gray-500 hover:text-gray-300"
        >
          Close
        </button>
      </div>

      {/* Form fields */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Title */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleBlur('title', title)}
            className="w-full rounded bg-gray-900 px-3 py-1.5 text-sm text-white outline-none ring-1 ring-gray-700 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleBlur('description', description)}
            rows={3}
            className="w-full resize-none rounded bg-gray-900 px-3 py-1.5 text-sm text-white outline-none ring-1 ring-gray-700 focus:ring-blue-500"
          />
        </div>

        {/* Camera Note */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Camera Note</label>
          <textarea
            value={cameraNote}
            onChange={(e) => setCameraNote(e.target.value)}
            onBlur={() => handleBlur('cameraNote', cameraNote)}
            rows={2}
            placeholder="e.g. Wide shot, dolly in..."
            className="w-full resize-none rounded bg-gray-900 px-3 py-1.5 text-sm text-white placeholder-gray-600 outline-none ring-1 ring-gray-700 focus:ring-blue-500"
          />
        </div>

        {/* Dialogue Note */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Dialogue</label>
          <textarea
            value={dialogueNote}
            onChange={(e) => setDialogueNote(e.target.value)}
            onBlur={() => handleBlur('dialogueNote', dialogueNote)}
            rows={2}
            placeholder="Character dialogue or voiceover..."
            className="w-full resize-none rounded bg-gray-900 px-3 py-1.5 text-sm text-white placeholder-gray-600 outline-none ring-1 ring-gray-700 focus:ring-blue-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Status</label>
          <button
            onClick={handleStatusToggle}
            className={`rounded px-3 py-1.5 text-xs font-medium ${
              scene.status === 'approved'
                ? 'bg-green-900/50 text-green-400 hover:bg-green-900/70'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {scene.status === 'approved' ? 'Approved' : 'Draft'}
          </button>
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Tags</label>
          <div className="flex flex-wrap gap-1.5">
            {scene.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-300"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-500 hover:text-red-400"
                >
                  x
                </button>
              </span>
            ))}
          </div>
          <div className="mt-1.5 flex gap-1.5">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTag()
              }}
              placeholder="Add tag..."
              className="flex-1 rounded bg-gray-900 px-2 py-1 text-xs text-white placeholder-gray-600 outline-none ring-1 ring-gray-700 focus:ring-blue-500"
            />
            <button
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
              className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 hover:bg-gray-600 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex gap-2 border-t border-gray-700 p-3">
        <button
          onClick={handleDuplicate}
          className="flex-1 rounded bg-gray-700 py-1.5 text-xs text-gray-300 hover:bg-gray-600"
        >
          Duplicate
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 rounded bg-red-900/30 py-1.5 text-xs text-red-400 hover:bg-red-900/50"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
