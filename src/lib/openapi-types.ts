/** Minimal OpenAPI 3 typings used by our static document builder. */

export type OpenApiDocument = {
  openapi: string
  info: {
    title: string
    version: string
    description?: string
    contact?: { name?: string; url?: string; email?: string }
  }
  servers?: { url: string; description?: string }[]
  tags?: { name: string; description?: string }[]
  paths: Record<string, OpenApiPathItem>
  components?: {
    securitySchemes?: Record<string, OpenApiSecurityScheme>
    schemas?: Record<string, OpenApiSchemaObject>
  }
}

export type OpenApiPathItem = {
  get?: OpenApiOperation
  post?: OpenApiOperation
  put?: OpenApiOperation
  patch?: OpenApiOperation
  delete?: OpenApiOperation
}

export type OpenApiOperation = {
  tags?: string[]
  summary?: string
  description?: string
  operationId?: string
  security?: Record<string, string[]>[]
  parameters?: OpenApiParameter[]
  requestBody?: OpenApiRequestBody
  responses: Record<string, OpenApiResponse>
}

export type OpenApiParameter = {
  name: string
  in: 'query' | 'path' | 'header' | 'cookie'
  required?: boolean
  description?: string
  schema?: OpenApiSchemaObject
}

export type OpenApiRequestBody = {
  required?: boolean
  content: Record<
    string,
    { schema?: OpenApiSchemaObject; examples?: Record<string, { value: unknown }> }
  >
}

export type OpenApiResponse = {
  description: string
  content?: Record<string, { schema?: OpenApiSchemaObject }>
}

export type OpenApiSecurityScheme = {
  type: string
  in?: string
  name?: string
  description?: string
  scheme?: string
}

export type OpenApiSchemaObject = Record<string, unknown>
