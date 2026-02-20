import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../shared/constants'
import type { ProjectFile } from '../shared/types'

const api = {
  // Project operations
  createProject: (name: string, directory: string): Promise<string> =>
    ipcRenderer.invoke(IPC_CHANNELS.PROJECT_CREATE, name, directory),

  openProject: (projectPath?: string): Promise<{ path: string; data: ProjectFile } | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.PROJECT_OPEN, projectPath),

  saveProject: (projectPath: string, data: ProjectFile): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.PROJECT_SAVE, projectPath, data),

  saveProjectAs: (data: ProjectFile): Promise<string | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.PROJECT_SAVE_AS, data),

  getRecentProjects: (): Promise<Array<{ name: string; path: string; modifiedAt: string }>> =>
    ipcRenderer.invoke(IPC_CHANNELS.PROJECT_GET_RECENT),

  // Dialog helpers
  openDirectoryDialog: (): Promise<string | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.DIALOG_OPEN_DIRECTORY),

  // App info
  getVersion: (): Promise<string> =>
    ipcRenderer.invoke(IPC_CHANNELS.APP_GET_VERSION)
}

export type ElectronAPI = typeof api

contextBridge.exposeInMainWorld('api', api)
