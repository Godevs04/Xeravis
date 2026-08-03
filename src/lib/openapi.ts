import type { OpenApiDocument } from './openapi-types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

/**
 * OpenAPI 3 description of first-party HTTP endpoints.
 * Payload CMS REST/GraphQL are documented as related surfaces, not fully expanded.
 */
export function buildOpenApiDocument(): OpenApiDocument {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Xelarvis Website API',
      version: '1.0.0',
      description: [
        'First-party HTTP endpoints for the Xelarvis marketing site and CMS helpers.',
        '',
        '### Related Payload surfaces',
        `- REST: \`${siteUrl}/api/{collection}\` (Payload CMS)`,
        `- GraphQL: \`${siteUrl}/api/graphql\``,
        `- GraphQL Playground: \`${siteUrl}/api/graphql-playground\``,
        `- Admin: \`${siteUrl}/admin\``,
        '',
        'Admin helper routes require an authenticated Payload session cookie.',
        'Public write endpoints are rate-limited.',
      ].join('\n'),
      contact: {
        name: 'Xelarvis Technologies',
        url: siteUrl,
        email: 'hello@xelarvis.in',
      },
    },
    servers: [
      { url: siteUrl, description: 'Current environment' },
      { url: 'http://localhost:3000', description: 'Local development' },
    ],
    tags: [
      { name: 'Public', description: 'Unauthenticated site endpoints' },
      { name: 'Admin', description: 'Requires Payload admin session' },
      { name: 'Payload', description: 'Built-in CMS API (reference)' },
    ],
    paths: {
      '/api/analytics/event': {
        post: {
          tags: ['Public'],
          summary: 'Record an analytics event',
          description:
            'Ingests pageviews and conversion events. Rate-limited. `meta` is bounded (primitive values only).',
          operationId: 'postAnalyticsEvent',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AnalyticsEventInput' },
                examples: {
                  pageview: {
                    value: {
                      type: 'pageview',
                      path: '/services',
                      referrer: 'https://www.google.com/',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Event accepted',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/OkResponse' },
                },
              },
            },
            '400': {
              description: 'Invalid event type',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/OkFalseResponse' },
                },
              },
            },
            '429': {
              description: 'Rate limit exceeded',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/OkFalseResponse' },
                },
              },
            },
          },
        },
      },
      '/api/downloads/{slug}': {
        get: {
          tags: ['Public'],
          summary: 'Download a file by slug',
          description:
            'Resolves a Downloads collection item and redirects to the file URL. Gated downloads require `email`. Rate-limited.',
          operationId: 'getDownloadBySlug',
          parameters: [
            {
              name: 'slug',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Download slug',
            },
            {
              name: 'email',
              in: 'query',
              required: false,
              schema: { type: 'string', format: 'email' },
              description: 'Required when the download is gated',
            },
          ],
          responses: {
            '302': { description: 'Redirect to file URL' },
            '401': {
              description: 'Gated download missing/invalid email',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/GatedDownloadError' },
                },
              },
            },
            '404': {
              description: 'Not found or file missing',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '429': {
              description: 'Rate limit exceeded',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/admin/search': {
        get: {
          tags: ['Admin'],
          summary: 'Admin command-palette search',
          description: 'Fan-out title search across CMS collections. Requires Payload session.',
          operationId: 'adminSearch',
          security: [{ payloadSession: [] }],
          parameters: [
            {
              name: 'q',
              in: 'query',
              required: true,
              schema: { type: 'string', minLength: 2, maxLength: 80 },
            },
          ],
          responses: {
            '200': {
              description: 'Search hits',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AdminSearchResponse' },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Search failed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/admin/notifications': {
        get: {
          tags: ['Admin'],
          summary: 'List notifications for the current user',
          operationId: 'listNotifications',
          security: [{ payloadSession: [] }],
          responses: {
            '200': {
              description: 'Notification feed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotificationsResponse' },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Failed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        post: {
          tags: ['Admin'],
          summary: 'Mark notification(s) read',
          description:
            'Mark one notification by `id` (ownership checked) or all unread with `markAll`.',
          operationId: 'markNotificationsRead',
          security: [{ payloadSession: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MarkNotificationsInput' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Updated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/OkResponse' },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '403': {
              description: 'Forbidden (notification not owned by user)',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Failed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/admin/newsletter/export': {
        get: {
          tags: ['Admin'],
          summary: 'Export newsletter subscribers as CSV',
          operationId: 'exportNewsletterCsv',
          security: [{ payloadSession: [] }],
          responses: {
            '200': {
              description: 'CSV download',
              content: {
                'text/csv': {
                  schema: { type: 'string', format: 'binary' },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Export failed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/openapi': {
        get: {
          tags: ['Public'],
          summary: 'OpenAPI document (this spec)',
          operationId: 'getOpenApi',
          responses: {
            '200': {
              description: 'OpenAPI 3 JSON',
              content: {
                'application/json': {
                  schema: { type: 'object', additionalProperties: true },
                },
              },
            },
          },
        },
      },
      '/api/{collection}': {
        get: {
          tags: ['Payload'],
          summary: 'Payload REST — list collection docs',
          description:
            'Built-in Payload REST. Access controlled per collection. Prefer CMS admin or Local API for writes.',
          operationId: 'payloadListCollection',
          parameters: [
            {
              name: 'collection',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                enum: [
                  'pages',
                  'services',
                  'solutions',
                  'industries',
                  'technologies',
                  'blogs',
                  'case-studies',
                  'careers',
                  'media',
                ],
              },
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', minimum: 1, maximum: 100 },
            },
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', minimum: 1 },
            },
            {
              name: 'depth',
              in: 'query',
              schema: { type: 'integer', minimum: 0, maximum: 2 },
            },
          ],
          responses: {
            '200': { description: 'Payload find response' },
            '401': { description: 'Unauthorized / insufficient access' },
            '404': { description: 'Unknown collection' },
          },
        },
      },
      '/api/graphql': {
        post: {
          tags: ['Payload'],
          summary: 'Payload GraphQL endpoint',
          operationId: 'payloadGraphQL',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['query'],
                  properties: {
                    query: { type: 'string' },
                    variables: { type: 'object', additionalProperties: true },
                    operationName: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'GraphQL result' },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        payloadSession: {
          type: 'apiKey',
          in: 'cookie',
          name: 'payload-token',
          description:
            'Payload authentication cookie from `/admin` login. Send credentials with browser session.',
        },
      },
      schemas: {
        OkResponse: {
          type: 'object',
          properties: { ok: { type: 'boolean', example: true } },
          required: ['ok'],
        },
        OkFalseResponse: {
          type: 'object',
          properties: { ok: { type: 'boolean', example: false } },
          required: ['ok'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            ok: { type: 'boolean' },
          },
        },
        GatedDownloadError: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Email required' },
            message: {
              type: 'string',
              example: 'This download is gated. Provide ?email=you@company.com to continue.',
            },
          },
        },
        AnalyticsEventInput: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['pageview', 'lead', 'application', 'download', 'newsletter'],
              default: 'pageview',
            },
            path: { type: 'string', maxLength: 500, example: '/' },
            referrer: { type: 'string', maxLength: 500 },
            meta: {
              type: 'object',
              additionalProperties: {
                oneOf: [
                  { type: 'string' },
                  { type: 'number' },
                  { type: 'boolean' },
                  { type: 'null' },
                ],
              },
              description: 'Bounded key/value metadata (primitives only)',
            },
          },
        },
        AdminSearchResponse: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  label: { type: 'string' },
                  href: { type: 'string' },
                  group: { type: 'string' },
                },
              },
            },
          },
        },
        NotificationsResponse: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  body: { type: 'string' },
                  href: { type: 'string' },
                  read: { type: 'boolean' },
                  type: { type: 'string' },
                  createdAt: { type: 'string' },
                },
              },
            },
            unread: { type: 'integer' },
          },
        },
        MarkNotificationsInput: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Single notification id' },
            markAll: { type: 'boolean', description: 'Mark all unread as read' },
          },
        },
      },
    },
  }
}
