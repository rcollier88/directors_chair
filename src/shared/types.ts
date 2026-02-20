export interface Project {
  name: string
  description: string
  createdAt: string
  modifiedAt: string
  settings: ProjectSettings
  scenes: Scene[]
  audioTimeline: AudioTimeline | null
}

export interface ProjectSettings {
  assetStrategy: 'bundle' | 'reference'
}

export interface Scene {
  id: string
  order: number
  title: string
  description: string
  cameraNote: string
  dialogueNote: string
  tags: string[]
  status: 'draft' | 'approved'
  assets: Asset[]
  generationRuns: GenerationRun[]
}

export interface Asset {
  id: string
  type: 'image' | 'video' | 'audio' | 'reference'
  filename: string
  originalPath: string
  thumbnailPath: string | null
}

export interface GenerationRun {
  id: string
  sceneId: string
  type: 'text' | 'image'
  prompt: string
  parameters: Record<string, unknown>
  outputAssetId: string | null
  status: 'pending' | 'running' | 'completed' | 'failed'
  timestamp: string
}

export interface AudioTimeline {
  trackPath: string
  sceneMarkers: SceneMarker[]
}

export interface SceneMarker {
  sceneId: string
  timestamp: number
}

export interface ProjectFile {
  version: 1
  project: Project
}
