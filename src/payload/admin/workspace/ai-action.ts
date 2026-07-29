'use server'

export type AiAssistState = {
  ok: boolean
  message: string
  output?: string
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

export async function runAiAssist(
  _prev: AiAssistState,
  formData: FormData,
): Promise<AiAssistState> {
  const mode = String(formData.get('mode') || 'blog-outline')
  const topic = String(formData.get('topic') || '').trim()
  const brief = String(formData.get('brief') || '').trim()

  if (!topic) {
    return { ok: false, message: 'Add a topic or title to generate from.' }
  }

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
          choices?: { message?: { content?: string } }[]
        }
        const output = json.choices?.[0]?.message?.content?.trim()
        if (output) {
          return { ok: true, message: 'Generated with your configured AI provider.', output }
        }
      }
    } catch {
      // fall through to templates
    }
  }

  const template = TEMPLATES[mode] || TEMPLATES['blog-outline']
  const output = [template(topic), brief ? `\n\nNotes:\n${brief}` : ''].join('')

  return {
    ok: true,
    message: apiKey
      ? 'Provider call failed — used structured workspace template.'
      : 'Generated with workspace templates. Add OPENAI_API_KEY or AI_GATEWAY_API_KEY for live model output.',
    output,
  }
}
