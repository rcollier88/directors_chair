import { mkdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { PROJECT_FILE_NAME, ASSETS_DIR, THUMBNAILS_DIR, createDefaultProject } from '../../shared/constants'
import type { ProjectFile } from '../../shared/types'

export async function createProject(name: string, directory: string): Promise<string> {
  const projectDir = join(directory, name)

  await mkdir(projectDir, { recursive: true })
  await mkdir(join(projectDir, ASSETS_DIR), { recursive: true })
  await mkdir(join(projectDir, THUMBNAILS_DIR), { recursive: true })

  const projectFile: ProjectFile = {
    version: 1,
    project: createDefaultProject(name)
  }

  const filePath = join(projectDir, PROJECT_FILE_NAME)
  await writeFile(filePath, JSON.stringify(projectFile, null, 2), 'utf-8')

  return projectDir
}

export async function loadProject(projectDir: string): Promise<ProjectFile> {
  const filePath = join(projectDir, PROJECT_FILE_NAME)
  const content = await readFile(filePath, 'utf-8')
  return JSON.parse(content) as ProjectFile
}

export async function saveProject(projectDir: string, data: ProjectFile): Promise<void> {
  data.project.modifiedAt = new Date().toISOString()
  const filePath = join(projectDir, PROJECT_FILE_NAME)
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// Recent projects stored in app data
import { app } from 'electron'

interface RecentEntry {
  name: string
  path: string
  modifiedAt: string
}

const MAX_RECENT = 10

async function getRecentFilePath(): Promise<string> {
  const appData = app.getPath('userData')
  return join(appData, 'recent-projects.json')
}

export async function getRecentProjects(): Promise<RecentEntry[]> {
  try {
    const filePath = await getRecentFilePath()
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content) as RecentEntry[]
  } catch {
    return []
  }
}

export async function addRecentProject(name: string, projectPath: string): Promise<void> {
  const recent = await getRecentProjects()
  const filtered = recent.filter((r) => r.path !== projectPath)
  filtered.unshift({ name, path: projectPath, modifiedAt: new Date().toISOString() })
  if (filtered.length > MAX_RECENT) filtered.length = MAX_RECENT

  const filePath = await getRecentFilePath()
  await writeFile(filePath, JSON.stringify(filtered, null, 2), 'utf-8')
}
