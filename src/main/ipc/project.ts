import { ipcMain, dialog, BrowserWindow } from 'electron'
import { IPC_CHANNELS, PROJECT_FILE_NAME } from '../../shared/constants'
import {
  createProject,
  loadProject,
  saveProject,
  getRecentProjects,
  addRecentProject
} from '../services/project-manager'
import type { ProjectFile } from '../../shared/types'

export function registerProjectHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.PROJECT_CREATE, async (_event, name: string, directory: string) => {
    const projectDir = await createProject(name, directory)
    await addRecentProject(name, projectDir)
    return projectDir
  })

  ipcMain.handle(IPC_CHANNELS.PROJECT_OPEN, async (_event, projectPath?: string) => {
    let targetPath = projectPath

    if (!targetPath) {
      const window = BrowserWindow.getFocusedWindow()
      if (!window) return null

      const result = await dialog.showOpenDialog(window, {
        title: 'Open Project',
        filters: [{ name: 'Project Files', extensions: ['json'] }],
        properties: ['openFile']
      })

      if (result.canceled || result.filePaths.length === 0) return null

      // User selected the project.json file — get the parent directory
      const selectedFile = result.filePaths[0]
      const path = await import('path')
      targetPath = path.dirname(selectedFile)
    }

    const data = await loadProject(targetPath)
    await addRecentProject(data.project.name, targetPath)
    return { path: targetPath, data }
  })

  ipcMain.handle(
    IPC_CHANNELS.PROJECT_SAVE,
    async (_event, projectPath: string, data: ProjectFile) => {
      await saveProject(projectPath, data)
    }
  )

  ipcMain.handle(IPC_CHANNELS.PROJECT_SAVE_AS, async (_event, data: ProjectFile) => {
    const window = BrowserWindow.getFocusedWindow()
    if (!window) return null

    const result = await dialog.showOpenDialog(window, {
      title: 'Save Project As',
      properties: ['openDirectory', 'createDirectory']
    })

    if (result.canceled || result.filePaths.length === 0) return null

    const targetDir = result.filePaths[0]
    await saveProject(targetDir, data)
    await addRecentProject(data.project.name, targetDir)
    return targetDir
  })

  ipcMain.handle(IPC_CHANNELS.PROJECT_GET_RECENT, async () => {
    return getRecentProjects()
  })

  ipcMain.handle(IPC_CHANNELS.DIALOG_OPEN_DIRECTORY, async () => {
    const window = BrowserWindow.getFocusedWindow()
    if (!window) return null

    const result = await dialog.showOpenDialog(window, {
      title: 'Select Directory',
      properties: ['openDirectory', 'createDirectory']
    })

    if (result.canceled || result.filePaths.length === 0) return null
    return result.filePaths[0]
  })

  ipcMain.handle(IPC_CHANNELS.APP_GET_VERSION, () => {
    const { app } = require('electron')
    return app.getVersion()
  })
}
