'use server'

import { getPayload } from '@/lib/payload'

export type AiAssistState = {
  ok: boolean
  message: string
  output?: string
  draftHref?: string
}

const TEMPLATES: Record<string, (topic: string) => string> = {
  'meta-description': (topic) =>
    `${topic.trim()} — practical guidance from XELARVIS on AI, healthcare analytics, and digital transformation. Learn how senior teams ship secure, production-ready solutions.`,
  'service-summary': (topic) =>
    `XELARVIS delivers ${topic.trim()} with research-informed methods, clear delivery process, and measurable business outcomes for healthcare and enterprise teams.`,
  'blog-outline': (topic) =>
    [
      `# ${topic.trim()}`,
      '',
      '## Why it matters',
      '- Business context',
      '- Risk of inaction',
      '',
      '## Practical approach',
      '1. Discover & assess',
      '2. Design the architecture',
      '3. Build & validate',
      '4. Deploy & improve',
      '',
      '## Outcomes',
      '- Reliability',
      '- Compliance readiness',
      '- Faster decision cycles',
      '',
      '## Next step',
      'Talk to XELARVIS about a scoped engagement.',
    ].join('\n'),
  'job-post': (topic) =>
    [
      `## About the role`,
      `We are hiring a ${topic.trim()} to build intelligent solutions across AI, healthcare, and enterprise platforms.`,
      '',
      '## Responsibilities',
      '- Own delivery end-to-end',
      '- Collaborate with clients and internal leads',
      '- Uphold quality, security, and documentation',
      '',
      '## Requirements',
      '- Relevant production experience',
      '- Strong communication',
      '- Comfort with modern stacks',
    ].join('\n'),
}

async function generateCopy(mode: string, topic: string, brief: string) {
  const apiKey =
    process.env.AI_GATEWAY_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.VERCEL_AI_GATEWAY_API_KEY

  if (apiKey) {
    try {
      const prompt = [
        'You are a senior content strategist for XELARVIS, an IT consulting and AI research company focused on healthcare AI, clinical data science, and digital transformation.',
        `Task mode: ${mode}`,
        `Topic: ${topic}`,
        brief ? `Brief: ${brief}` : '',
        'Write concise, premium B2B copy. Avoid fluff and emoji.',
      ]
        .filter(Boolean)
        .join('\n')

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Return only the requested copy.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.4,
        }),
      })

      if (res.ok) {
        const json = (await res.json()) as {
          choices?: Array<{ message?: { content?: string } }>
        }
        const output = json.choices?.[0]?.message?.content?.trim()
        if (output) {
          return {
            output,
            message: 'Generated with your configured AI provider.',
          }
        }
      }
    } catch {
      // fall through
    }
  }

  const template = TEMPLATES[mode] || TEMPLATES['blog-outline']
  return {
    output: [template(topic), brief ? `\n\nNotes:\n${brief}` : ''].join(''),
    message: apiKey
      ? 'Provider call failed — used structured workspace template.'
      : 'Generated with workspace templates. Add OPENAI_API_KEY or AI_GATEWAY_API_KEY for live model output.',
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}

export async function runAiAssist(
  _prev: AiAssistState,
  formData: FormData,
): Promise<AiAssistState> {
  const payload = await getPayload()
  const { headers: getHeaders } = await import('next/headers')
  const { user } = await payload.auth({ headers: await getHeaders() })
  if (!user) {
    return { ok: false, message: 'Sign in to the CMS to use AI assist.' }
  }

  const mode = String(formData.get('mode') || 'blog-outline').slice(0, 40)
  const topic = String(formData.get('topic') || '')
    .trim()
    .slice(0, 200)
  const brief = String(formData.get('brief') || '')
    .trim()
    .slice(0, 2000)
  const writeBack = String(formData.get('writeBack') || '') === 'on'

  if (!topic) {
    return { ok: false, message: 'Add a topic or title to generate from.' }
  }

  const generated = await generateCopy(mode, topic, brief)

  if (!writeBack) {
    return {
      ok: true,
      message: generated.message,
      output: generated.output,
    }
  }

  try {
    if (mode === 'job-post') {
      const created = await payload.create({
        collection: 'careers',
        overrideAccess: true,
        draft: true,
        data: {
          title: topic.slice(0, 140),
          slug: slugify(topic) || `role-${Date.now()}`,
          location: 'Remote / Hybrid',
          type: 'full-time',
          workMode: 'hybrid',
          aboutRole: generated.output,
          active: false,
          _status: 'draft',
        },
      })

      return {
        ok: true,
        message: `${generated.message} Draft job created — review before publishing.`,
        output: generated.output,
        draftHref: `/admin/collections/careers/${created.id}`,
      }
    }

    const created = await payload.create({
      collection: 'blogs',
      overrideAccess: true,
      draft: true,
      data: {
        title: topic.slice(0, 140),
        slug: slugify(topic) || `draft-${Date.now()}`,
        excerpt: (generated.output.slice(0, 280) || topic).trim(),
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: generated.output,
                    version: 1,
                  },
                ],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        } as never,
        insightType: 'blog',
        _status: 'draft',
      },
    })

    return {
      ok: true,
      message: `${generated.message} Draft insight created — open to refine in Lexical.`,
      output: generated.output,
      draftHref: `/admin/collections/blogs/${created.id}`,
    }
  } catch {
    return {
      ok: true,
      message: `${generated.message} Write-back failed — copy the draft below and paste manually.`,
      output: generated.output,
    }
  }
}
