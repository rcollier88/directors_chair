import { useProjectStore } from '../../stores/project-store'
import { StoryboardView } from '../storyboard/StoryboardView'

export function MainContent(): JSX.Element {
  const { activeView } = useProjectStore()

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-gray-900">
      {activeView === 'storyboard' && <StoryboardView />}
    </main>
  )
}
