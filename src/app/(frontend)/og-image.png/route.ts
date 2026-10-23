import OpenGraphImage from '../opengraph-image'

export const runtime = 'edge'

/** Stable URL for the default social image (the file-convention route gets a hashed path). */
export function GET() {
  return OpenGraphImage()
}
