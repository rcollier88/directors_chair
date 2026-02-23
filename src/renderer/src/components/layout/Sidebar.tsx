import { useProjectStore, type ViewId } from '../../stores/project-store'

const NAV_ITEMS: Array<{ id: ViewId; label: string }> = [
  { id: 'storyboard', label: 'Storyboard' }
]

export function Sidebar(): JSX.Element {
  const { project, isDirty, activeView, saveProject, closeProject, setActiveView } =
    useProjectStore()

  const handleSave = async (): Promise<void> => {
    try {
      await saveProject()
    } catch (err) {
      console.error('Failed to save:', err)
    }
  }

  return (
    <aside className="flex h-full w-[260px] flex-shrink-0 flex-col border-r border-gray-700 bg-gray-800">
      {/* Project header */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h2 className="truncate text-sm font-semibold text-white">
            {project?.name ?? 'Untitled'}
          </h2>
          {isDirty && <span className="ml-2 text-xs text-yellow-500">unsaved</span>}
        </div>
        <p className="mt-1 truncate text-xs text-gray-500">
          {project ? `${project.scenes.length} scene${project.scenes.length !== 1 ? 's' : ''}` : ''}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full rounded px-3 py-2 text-left text-sm ${
              activeView === item.id
                ? 'bg-blue-600/20 text-blue-400 font-medium'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-gray-700 p-2 space-y-1">
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className="w-full rounded px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 disabled:text-gray-600 disabled:hover:bg-transparent"
        >
          Save Project {isDirty ? '(Ctrl+S)' : ''}
        </button>
        <button
          onClick={closeProject}
          className="w-full rounded px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
        >
          Close Project
        </button>
      </div>
    </aside>
  )
}
