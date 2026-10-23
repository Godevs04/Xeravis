import type {
  Adapter,
  HandleDelete,
  HandleUpload,
  StaticHandler,
} from '@payloadcms/plugin-cloud-storage/types'
import { v2 as cloudinary } from 'cloudinary'
import type { UploadApiResponse } from 'cloudinary'

import { logger } from '@/lib/logger'

const log = logger.child('cloudinary')

export const isCloudinaryEnabled = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
  )

const CONTENT_TYPES: Record<string, string> = {
  avif: 'image/avif',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  pdf: 'application/pdf',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export const contentTypeFor = (filename: string) =>
  CONTENT_TYPES[filename.split('.').pop()?.toLowerCase() || ''] || 'application/octet-stream'

/**
 * Files are stored as private ("authenticated") raw assets under `<folder>/<filename>`, so the
 * Payload filename and `/api/media/file/<filename>` URL stay unchanged. Payload checks the Media
 * read access (which hides candidate resumes) before `staticHandler` streams the file, so nothing
 * is reachable through a public Cloudinary URL.
 */
export const cloudinaryPublicId = (filename: string) =>
  `${process.env.CLOUDINARY_FOLDER || 'xelarvis'}/${filename}`

export const configureCloudinary = () =>
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })

export const uploadToCloudinary = (filename: string, buffer: Buffer) =>
  new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          public_id: cloudinaryPublicId(filename),
          resource_type: 'raw',
          type: 'authenticated',
          overwrite: true,
        },
        (error, result) => {
          if (error || !result) reject(error || new Error('Cloudinary upload failed'))
          else resolve(result)
        },
      )
      .end(buffer)
  })

/** Streams a stored file back through the app (signed, short-lived Cloudinary URL). */
export async function fetchCloudinaryFile(filename: string): Promise<Response> {
  const url = cloudinary.url(cloudinaryPublicId(filename), {
    resource_type: 'raw',
    type: 'authenticated',
    sign_url: true,
    secure: true,
  })
  const upstream = await fetch(url)
  if (!upstream.ok || !upstream.body) {
    if (upstream.status !== 404) log.warn(`Fetch ${filename} failed: HTTP ${upstream.status}`)
    return new Response(null, { status: upstream.status === 404 ? 404 : 502 })
  }
  const headers = new Headers({
    'Content-Type': contentTypeFor(filename),
    'Cache-Control': 'private, max-age=3600',
  })
  const length = upstream.headers.get('content-length')
  if (length) headers.set('Content-Length', length)
  return new Response(upstream.body, { status: 200, headers })
}

export const createCloudinaryAdapter = (): Adapter => {
  configureCloudinary()

  const handleUpload: HandleUpload = async ({ file }) => {
    await uploadToCloudinary(file.filename, file.buffer)
  }

  const handleDelete: HandleDelete = async ({ filename }) => {
    try {
      await cloudinary.uploader.destroy(cloudinaryPublicId(filename), {
        resource_type: 'raw',
        type: 'authenticated',
        invalidate: true,
      })
    } catch (error) {
      log.error('Delete failed:', error)
    }
  }

  const staticHandler: StaticHandler = (_req, { params: { filename } }) =>
    fetchCloudinaryFile(filename)

  return () => ({
    name: 'cloudinary',
    handleUpload,
    handleDelete,
    staticHandler,
  })
}
