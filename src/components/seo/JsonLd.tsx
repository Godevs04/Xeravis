type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[] | null | undefined
  id?: string
}

/** Server-safe JSON-LD script tag. */
export function JsonLd({ data, id }: JsonLdProps) {
  if (!data) return null
  const payload = Array.isArray(data) ? data.filter(Boolean) : data
  if (Array.isArray(payload) && payload.length === 0) return null

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, '\\u003c'),
      }}
    />
  )
}
