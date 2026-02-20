import { create } from 'zustand'
import type { Project, ProjectFile, Scene } from '../../../shared/types'
import { createDefaultProject } from '../../../shared/constants'

interface ProjectState {
  // Current project state
  project: Project | null
  projectPath: string | null
  isDirty: boolean
  isLoading: boolean

  // Recent projects
  recentProjects: Array<{ name: string; path: string; modifiedAt: string }>

  // Actions
  createProject: (name: string, directory: string) => Promise<void>
  openProject: (projectPath?: string) => Promise<void>
  saveProject: () => Promise<void>
  saveProjectAs: () => Promise<void>
  closeProject: () => void
  loadRecentProjects: () => Promise<void>
  updateProject: (updates: Partial<Project>) => void
  markDirty: () => void
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,
  projectPath: null,
  isDirty: false,
  isLoading: false,
  recentProjects: [],

  createProject: async (name: string, directory: string) => {
    set({ isLoading: true })
    try {
      const projectDir = await window.api.createProject(name, directory)
      const project = createDefaultProject(name)
      set({ project, projectPath: projectDir, isDirty: false, isLoading: false })
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
          isLoading: false
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
    set({ project: null, projectPath: null, isDirty: false })
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

  markDirty: () => set({ isDirty: true })
}))
