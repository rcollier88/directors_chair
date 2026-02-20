export const IPC_CHANNELS = {
  // Project operations
  PROJECT_CREATE: 'project:create',
  PROJECT_OPEN: 'project:open',
  PROJECT_SAVE: 'project:save',
  PROJECT_SAVE_AS: 'project:save-as',
  PROJECT_GET_RECENT: 'project:get-recent',

  // Dialog helpers
  DIALOG_OPEN_DIRECTORY: 'dialog:open-directory',
  DIALOG_OPEN_FILE: 'dialog:open-file',

  // App
  APP_GET_VERSION: 'app:get-version'
} as const

export const PROJECT_FILE_NAME = 'project.json'
export const ASSETS_DIR = 'assets'
export const THUMBNAILS_DIR = '.thumbnails'

export const DEFAULT_PROJECT_SETTINGS = {
  assetStrategy: 'bundle' as const
}

export function createDefaultProject(name: string): import('./types').Project {
  return {
    name,
    description: '',
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    settings: { ...DEFAULT_PROJECT_SETTINGS },
    scenes: [],
    audioTimeline: null
  }
}
