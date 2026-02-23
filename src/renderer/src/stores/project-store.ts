import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { Project, ProjectFile, Scene } from '../../../shared/types'
import { createDefaultProject } from '../../../shared/constants'

export type ViewId = 'storyboard' | 'settings'

interface ProjectState {
  // Current project state
  project: Project | null
  projectPath: string | null
  isDirty: boolean
  isLoading: boolean

  // UI state
  activeView: ViewId
  selectedSceneId: string | null

  // Recent projects
  recentProjects: Array<{ name: string; path: string; modifiedAt: string }>

  // Project actions
  createProject: (name: string, directory: string) => Promise<void>
  openProject: (projectPath?: string) => Promise<void>
  saveProject: () => Promise<void>
  saveProjectAs: () => Promise<void>
  closeProject: () => void
  loadRecentProjects: () => Promise<void>
  updateProject: (updates: Partial<Project>) => void
  markDirty: () => void

  // View actions
  setActiveView: (view: ViewId) => void

  // Scene actions
  addScene: () => void
  deleteScene: (sceneId: string) => void
  duplicateScene: (sceneId: string) => void
  updateScene: (sceneId: string, updates: Partial<Scene>) => void
  selectScene: (sceneId: string | null) => void
  reorderScenes: (activeId: string, overId: string) => void
}

function createDefaultScene(order: number): Scene {
  return {
    id: uuidv4(),
    order,
    title: `Scene ${order + 1}`,
    description: '',
    cameraNote: '',
    dialogueNote: '',
    tags: [],
    status: 'draft',
    assets: [],
    generationRuns: []
  }
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,
  projectPath: null,
  isDirty: false,
  isLoading: false,
  activeView: 'storyboard',
  selectedSceneId: null,
  recentProjects: [],

  createProject: async (name: string, directory: string) => {
    set({ isLoading: true })
    try {
      const projectDir = await window.api.createProject(name, directory)
      const project = createDefaultProject(name)
      set({
        project,
        projectPath: projectDir,
        isDirty: false,
        isLoading: false,
        selectedSceneId: null,
        activeView: 'storyboard'
      })
      await get().loadRecentProjects()
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  openProject: async (projectPath?: string) => {
    set({ isLoading: true })
    try {
      const result = await window.api.openProject(projectPath)
      if (result) {
        set({
          project: result.data.project,
          projectPath: result.path,
          isDirty: false,
          isLoading: false,
          selectedSceneId: null,
          activeView: 'storyboard'
        })
        await get().loadRecentProjects()
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  saveProject: async () => {
    const { project, projectPath } = get()
    if (!project || !projectPath) return

    const data: ProjectFile = { version: 1, project }
    await window.api.saveProject(projectPath, data)
    set({ isDirty: false })
  },

  saveProjectAs: async () => {
    const { project } = get()
    if (!project) return

    const data: ProjectFile = { version: 1, project }
    const newPath = await window.api.saveProjectAs(data)
    if (newPath) {
      set({ projectPath: newPath, isDirty: false })
      await get().loadRecentProjects()
    }
  },

  closeProject: () => {
    set({
      project: null,
      projectPath: null,
      isDirty: false,
      selectedSceneId: null,
      activeView: 'storyboard'
    })
  },

  loadRecentProjects: async () => {
    const recent = await window.api.getRecentProjects()
    set({ recentProjects: recent })
  },

  updateProject: (updates: Partial<Project>) => {
    const { project } = get()
    if (!project) return
    set({ project: { ...project, ...updates }, isDirty: true })
  },

  markDirty: () => set({ isDirty: true }),

  setActiveView: (view: ViewId) => set({ activeView: view }),

  addScene: () => {
    const { project } = get()
    if (!project) return

    const newScene = createDefaultScene(project.scenes.length)
    const updatedScenes = [...project.scenes, newScene]
    set({
      project: { ...project, scenes: updatedScenes },
      isDirty: true,
      selectedSceneId: newScene.id
    })
  },

  deleteScene: (sceneId: string) => {
    const { project, selectedSceneId } = get()
    if (!project) return

    const updatedScenes = project.scenes
      .filter((s) => s.id !== sceneId)
      .map((s, i) => ({ ...s, order: i }))

    set({
      project: { ...project, scenes: updatedScenes },
      isDirty: true,
      selectedSceneId: selectedSceneId === sceneId ? null : selectedSceneId
    })
  },

  duplicateScene: (sceneId: string) => {
    const { project } = get()
    if (!project) return

    const sourceScene = project.scenes.find((s) => s.id === sceneId)
    if (!sourceScene) return

    const sourceIndex = project.scenes.findIndex((s) => s.id === sceneId)
    const newScene: Scene = {
      ...sourceScene,
      id: uuidv4(),
      title: `${sourceScene.title} (copy)`,
      assets: [],
      generationRuns: []
    }

    const updatedScenes = [...project.scenes]
    updatedScenes.splice(sourceIndex + 1, 0, newScene)
    const reordered = updatedScenes.map((s, i) => ({ ...s, order: i }))

    set({
      project: { ...project, scenes: reordered },
      isDirty: true,
      selectedSceneId: newScene.id
    })
  },

  updateScene: (sceneId: string, updates: Partial<Scene>) => {
    const { project } = get()
    if (!project) return

    const updatedScenes = project.scenes.map((s) =>
      s.id === sceneId ? { ...s, ...updates } : s
    )

    set({
      project: { ...project, scenes: updatedScenes },
      isDirty: true
    })
  },

  selectScene: (sceneId: string | null) => set({ selectedSceneId: sceneId }),

  reorderScenes: (activeId: string, overId: string) => {
    const { project } = get()
    if (!project || activeId === overId) return

    const scenes = [...project.scenes]
    const oldIndex = scenes.findIndex((s) => s.id === activeId)
    const newIndex = scenes.findIndex((s) => s.id === overId)
    if (oldIndex === -1 || newIndex === -1) return

    const [moved] = scenes.splice(oldIndex, 1)
    scenes.splice(newIndex, 0, moved)
    const reordered = scenes.map((s, i) => ({ ...s, order: i }))

    set({
      project: { ...project, scenes: reordered },
      isDirty: true
    })
  }
}))
