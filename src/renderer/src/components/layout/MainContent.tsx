import { useProjectStore } from '../../stores/project-store'

export function MainContent(): JSX.Element {
  const { project } = useProjectStore()

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-gray-900">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-700 px-6 py-3">
        <h1 className="text-lg font-semibold text-white">{project?.name ?? 'Untitled'}</h1>
      </div>

      {/* Content area */}
      <div className="flex flex-1 items-center justify-center overflow-auto p-6">
        <div className="text-center">
          <p className="text-lg text-gray-400">Storyboard</p>
          <p className="mt-2 text-sm text-gray-500">
            No scenes yet. Scenes will appear here once you add them.
          </p>
          <p className="mt-4 text-xs text-gray-600">
            Phase 2 will add scene creation and drag-and-drop reordering.
          </p>
        </div>
      </div>
    </main>
  )
}
