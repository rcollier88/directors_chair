import { ipcMain, dialog, shell, BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../../shared/constants'
import {
  importAsset,
  deleteAsset,
  getAssetAbsolutePath,
  getThumbnailAbsolutePath
} from '../services/asset-manager'
import type { Asset } from '../../shared/types'

export function registerAssetHandlers(): void {
  // Import files into a scene
  ipcMain.handle(
    IPC_CHANNELS.ASSET_IMPORT,
    async (_event, projectDir: string, sceneId: string, filePaths: string[]) => {
      const assets: Asset[] = []
      const validPaths = filePaths.filter((p) => typeof p === 'string' && p.length > 0)
      for (const filePath of validPaths) {
        const asset = await importAsset(projectDir, sceneId, filePath)
        assets.push(asset)
      }
      return assets
    }
  )

  // Delete an asset
  ipcMain.handle(
    IPC_CHANNELS.ASSET_DELETE,
    async (_event, projectDir: string, sceneId: string, asset: Asset) => {
      await deleteAsset(projectDir, sceneId, asset)
    }
  )

  // Reveal asset in Explorer
  ipcMain.handle(
    IPC_CHANNELS.ASSET_REVEAL,
    async (_event, projectDir: string, sceneId: string, filename: string) => {
      const absPath = getAssetAbsolutePath(projectDir, sceneId, filename)
      shell.showItemInFolder(absPath)
    }
  )

  // Get absolute path for rendering (used by renderer to display images)
  ipcMain.handle(
    IPC_CHANNELS.ASSET_GET_PATH,
    async (
      _event,
      projectDir: string,
      type: 'asset' | 'thumbnail',
      sceneId: string,
      filenameOrRelPath: string
    ) => {
      if (type === 'thumbnail') {
        return getThumbnailAbsolutePath(projectDir, filenameOrRelPath)
      }
      return getAssetAbsolutePath(projectDir, sceneId, filenameOrRelPath)
    }
  )

  // Open file picker for images
  ipcMain.handle(IPC_CHANNELS.ASSET_PICK_FILES, async () => {
    const window = BrowserWindow.getFocusedWindow()
    if (!window) return []

    const result = await dialog.showOpenDialog(window, {
      title: 'Import Images',
      filters: [
        { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['openFile', 'multiSelections']
    })

    if (result.canceled) return []
    return result.filePaths
  })
}
