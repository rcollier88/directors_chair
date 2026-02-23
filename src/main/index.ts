import { app, shell, BrowserWindow, protocol, net } from 'electron'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { registerProjectHandlers } from './ipc/project'
import { registerAssetHandlers } from './ipc/assets'

// Register custom protocol for serving local asset files.
// This is needed because in dev mode the renderer loads from http://localhost,
// which blocks file:// URLs due to browser security.
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'dc-asset',
    privileges: {
      bypassCSP: true,
      stream: true,
      supportFetchAPI: true
    }
  }
])

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    show: false,
    title: "Director's Chair",
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.directors-chair')

  // Handle dc-asset:// URLs by serving local files
  protocol.handle('dc-asset', (request) => {
    const url = new URL(request.url)
    let filePath = decodeURIComponent(url.pathname)
    // Remove leading slash on Windows (pathname starts with /)
    if (process.platform === 'win32' && filePath.startsWith('/')) {
      filePath = filePath.slice(1)
    }
    return net.fetch(pathToFileURL(filePath).toString())
  })

  registerProjectHandlers()
  registerAssetHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
