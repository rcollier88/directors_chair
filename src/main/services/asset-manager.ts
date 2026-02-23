import { mkdir, copyFile, unlink, readdir, stat } from 'fs/promises'
import { join, basename, extname } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { nativeImage } from 'electron'
import { ASSETS_DIR, THUMBNAILS_DIR } from '../../shared/constants'
import type { Asset } from '../../shared/types'

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg']
const THUMBNAIL_SIZE = 300

export async function importAsset(
  projectDir: string,
  sceneId: string,
  sourcePath: string
): Promise<Asset> {
  const ext = extname(sourcePath).toLowerCase()
  const assetId = uuidv4()
  const filename = `${assetId}${ext}`

  // Ensure scene asset directory exists
  const sceneAssetDir = join(projectDir, ASSETS_DIR, `scene-${sceneId}`)
  await mkdir(sceneAssetDir, { recursive: true })

  // Copy file into project
  const destPath = join(sceneAssetDir, filename)
  await copyFile(sourcePath, destPath)

  // Determine asset type
  const type = IMAGE_EXTENSIONS.includes(ext) ? 'image' : 'reference'

  // Generate thumbnail for images
  let thumbnailPath: string | null = null
  if (type === 'image' && ext !== '.svg') {
    thumbnailPath = await generateThumbnail(projectDir, sceneId, destPath, assetId)
  }

  return {
    id: assetId,
    type,
    filename,
    originalPath: sourcePath,
    thumbnailPath
  }
}

async function generateThumbnail(
  projectDir: string,
  sceneId: string,
  imagePath: string,
  assetId: string
): Promise<string | null> {
  try {
    const thumbDir = join(projectDir, THUMBNAILS_DIR, `scene-${sceneId}`)
    await mkdir(thumbDir, { recursive: true })

    const image = nativeImage.createFromPath(imagePath)
    if (image.isEmpty()) return null

    const size = image.getSize()
    const ratio = Math.min(THUMBNAIL_SIZE / size.width, THUMBNAIL_SIZE / size.height, 1)
    const resized = image.resize({
      width: Math.round(size.width * ratio),
      height: Math.round(size.height * ratio)
    })

    const thumbFilename = `${assetId}_thumb.png`
    const thumbPath = join(thumbDir, thumbFilename)
    const { writeFile } = await import('fs/promises')
    await writeFile(thumbPath, resized.toPNG())

    // Return relative path from project root
    return join(THUMBNAILS_DIR, `scene-${sceneId}`, thumbFilename)
  } catch {
    return null
  }
}

export async function deleteAsset(
  projectDir: string,
  sceneId: string,
  asset: Asset
): Promise<void> {
  // Delete the asset file
  const assetPath = join(projectDir, ASSETS_DIR, `scene-${sceneId}`, asset.filename)
  try {
    await unlink(assetPath)
  } catch {
    // File may not exist
  }

  // Delete the thumbnail if it exists
  if (asset.thumbnailPath) {
    const thumbPath = join(projectDir, asset.thumbnailPath)
    try {
      await unlink(thumbPath)
    } catch {
      // Thumbnail may not exist
    }
  }
}

export function getAssetAbsolutePath(
  projectDir: string,
  sceneId: string,
  filename: string
): string {
  return join(projectDir, ASSETS_DIR, `scene-${sceneId}`, filename)
}

export function getThumbnailAbsolutePath(
  projectDir: string,
  relativePath: string
): string {
  return join(projectDir, relativePath)
}
