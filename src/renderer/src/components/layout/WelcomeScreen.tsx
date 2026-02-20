import { useState } from 'react'
import { useProjectStore } from '../../stores/project-store'

export function WelcomeScreen(): JSX.Element {
  const { createProject, openProject, recentProjects, isLoading } = useProjectStore()
  const [showNewProject, setShowNewProject] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDir, setProjectDir] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSelectDirectory = async (): Promise<void> => {
    const dir = await window.api.openDirectoryDialog()
    if (dir) setProjectDir(dir)
  }

  const handleCreate = async (): Promise<void> => {
    if (!projectName.trim() || !projectDir) return
    setError(null)
    try {
      await createProject(projectName.trim(), projectDir)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    }
  }

  const handleOpen = async (path?: string): Promise<void> => {
    setError(null)
    try {
      await openProject(path)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open project')
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-lg p-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Director&apos;s Chair</h1>
        <p className="mb-8 text-gray-400">Storyboard creation with local AI</p>

        {error && (
          <div className="mb-4 rounded bg-red-900/50 px-4 py-2 text-sm text-red-300">{error}</div>
        )}

        {!showNewProject ? (
          <div className="space-y-3">
            <button
              onClick={() => setShowNewProject(true)}
              disabled={isLoading}
              className="w-full rounded bg-blue-600 px-4 py-3 text-left font-medium text-white hover:bg-blue-500 disabled:opacity-50"
            >
              New Project
            </button>
            <button
              onClick={() => handleOpen()}
              disabled={isLoading}
              className="w-full rounded bg-gray-700 px-4 py-3 text-left font-medium text-white hover:bg-gray-600 disabled:opacity-50"
            >
              Open Project...
            </button>

            {recentProjects.length > 0 && (
              <div className="mt-6">
                <h2 className="mb-2 text-sm font-medium text-gray-400">Recent Projects</h2>
                <div className="space-y-1">
                  {recentProjects.map((rp) => (
                    <button
                      key={rp.path}
                      onClick={() => handleOpen(rp.path)}
                      disabled={isLoading}
                      className="w-full rounded px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                    >
                      <div className="font-medium">{rp.name}</div>
                      <div className="truncate text-xs text-gray-500">{rp.path}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My Storyboard"
                autoFocus
                className="w-full rounded bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-none ring-1 ring-gray-600 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate()
                }}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Location</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={projectDir}
                  readOnly
                  placeholder="Select a directory..."
                  className="flex-1 rounded bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-none ring-1 ring-gray-600"
                />
                <button
                  onClick={handleSelectDirectory}
                  className="rounded bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-600"
                >
                  Browse
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowNewProject(false)}
                className="rounded bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={!projectName.trim() || !projectDir || isLoading}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
