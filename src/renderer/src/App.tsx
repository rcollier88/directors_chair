import { useEffect } from 'react'
import { useProjectStore } from './stores/project-store'
import { Sidebar } from './components/layout/Sidebar'
import { MainContent } from './components/layout/MainContent'
import { WelcomeScreen } from './components/layout/WelcomeScreen'

function App(): JSX.Element {
  const { project, loadRecentProjects } = useProjectStore()

  useEffect(() => {
    loadRecentProjects()
  }, [loadRecentProjects])

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
