import type { HandleDelete, HandleUpload } from '@payloadcms/plugin-cloud-storage/types'
import { v2 as cloudinary } from 'cloudinary'
import type { UploadApiResponse } from 'cloudinary'

export const isCloudinaryEnabled = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  )

export const createCloudinaryAdapter = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  const folder = process.env.CLOUDINARY_FOLDER || 'xelarvis'

  const handleUpload: HandleUpload = async ({ file }) => {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            public_id: file.filename.replace(/\.[^/.]+$/, ''),
            resource_type: 'auto',
            overwrite: false,
          },
          (error, uploadResult) => {
            if (error || !uploadResult) reject(error || new Error('Cloudinary upload failed'))
            else resolve(uploadResult)
          },
        )
        .end(file.buffer)
    })

    file.filename = result.public_id
    // @ts-expect-error Payload mutates file URL for storage adapters
    file.url = result.secure_url
  }

  const handleDelete: HandleDelete = async ({ filename }) => {
    try {
      await cloudinary.uploader.destroy(`${folder}/${filename.replace(/\.[^/.]+$/, '')}`)
    } catch (error) {
      console.error('Cloudinary delete error:', error)
    }
  }

  return () => ({
    name: 'cloudinary',
    handleUpload,
    handleDelete,
    staticHandler: () => new Response(null, { status: 404 }),
  })
}
