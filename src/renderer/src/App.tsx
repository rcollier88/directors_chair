import { useEffect } from 'react'
import { useProjectStore } from './stores/project-store'
import { Sidebar } from './components/layout/Sidebar'
import { MainContent } from './components/layout/MainContent'
import { WelcomeScreen } from './components/layout/WelcomeScreen'

function App(): JSX.Element {
  const { project, loadRecentProjects, saveProject } = useProjectStore()

  useEffect(() => {
    loadRecentProjects()
  }, [loadRecentProjects])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveProject()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [saveProject])

  if (!project) {
    return <WelcomeScreen />
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <MainContent />
    </div>
  )
}

export default App
