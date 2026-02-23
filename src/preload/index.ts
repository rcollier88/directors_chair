import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { IPC_CHANNELS } from '../shared/constants'
import type { ProjectFile, Asset } from '../shared/types'

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

  // Asset operations
  importAssets: (projectDir: string, sceneId: string, filePaths: string[]): Promise<Asset[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.ASSET_IMPORT, projectDir, sceneId, filePaths),

  deleteAsset: (projectDir: string, sceneId: string, asset: Asset): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.ASSET_DELETE, projectDir, sceneId, asset),

  revealAsset: (projectDir: string, sceneId: string, filename: string): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.ASSET_REVEAL, projectDir, sceneId, filename),

  getAssetPath: (
    projectDir: string,
    type: 'asset' | 'thumbnail',
    sceneId: string,
    filenameOrRelPath: string
  ): Promise<string> =>
    ipcRenderer.invoke(IPC_CHANNELS.ASSET_GET_PATH, projectDir, type, sceneId, filenameOrRelPath),

  pickFiles: (): Promise<string[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.ASSET_PICK_FILES),

  // Get native file path from a dropped File object (works with contextIsolation)
  getPathForFile: (file: File): string =>
    webUtils.getPathForFile(file),

  // Dialog helpers
  openDirectoryDialog: (): Promise<string | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.DIALOG_OPEN_DIRECTORY),

  // App info
  getVersion: (): Promise<string> =>
    ipcRenderer.invoke(IPC_CHANNELS.APP_GET_VERSION)
}

export type ElectronAPI = typeof api

contextBridge.exposeInMainWorld('api', api)
