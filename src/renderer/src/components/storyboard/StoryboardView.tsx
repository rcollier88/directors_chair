import { useProjectStore } from '../../stores/project-store'
import { StoryboardGrid } from './StoryboardGrid'
import { SceneEditor } from '../scene-editor/SceneEditor'

export function StoryboardView(): JSX.Element {
  const { project, selectedSceneId, addScene } = useProjectStore()
  const selectedScene = project?.scenes.find((s) => s.id === selectedSceneId) ?? null

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: Grid */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-700 px-4 py-2">
          <h1 className="text-sm font-semibold text-white">Storyboard</h1>
          <button
            onClick={addScene}
            className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
          >
            + Add Scene
          </button>
        </div>

        {/* Grid area */}
        <div className="flex-1 overflow-auto p-4">
          {project && project.scenes.length > 0 ? (
            <StoryboardGrid />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400">No scenes yet</p>
                <button
                  onClick={addScene}
                  className="mt-3 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                >
                  Create First Scene
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Scene editor panel */}
      {selectedScene && (
        <div className="w-[380px] flex-shrink-0 border-l border-gray-700">
          <SceneEditor scene={selectedScene} />
        </div>
      )}
    </div>
  )
}
