import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  configureCloudinary,
  contentTypeFor,
  fetchCloudinaryFile,
  isCloudinaryEnabled,
} from '@/payload/plugins/cloudinaryAdapter'

/**
 * Serves a Media file from storage without going through the public `/api/media/file/*` route,
 * for files that are private to anonymous visitors (e.g. gated downloads).
 */
export async function serveMediaFile(
  filename: string,
  { staticDir, downloadName }: { staticDir: string; downloadName?: string },
): Promise<Response> {
  const safeName = path.basename(filename)
  let response: Response
  if (isCloudinaryEnabled()) {
    configureCloudinary()
    response = await fetchCloudinaryFile(safeName)
  } else {
    try {
      const data = await readFile(path.resolve(staticDir, safeName))
      response = new Response(new Uint8Array(data), {
        status: 200,
        headers: {
          'Content-Type': contentTypeFor(safeName),
          'Content-Length': String(data.byteLength),
        },
      })
    } catch {
      response = new Response(null, { status: 404 })
    }
  }
  if (response.ok) {
    response.headers.set('Cache-Control', 'private, no-store')
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="${(downloadName || safeName).replace(/["\\\r\n]/g, '')}"`,
    )
  }
  return response
}
