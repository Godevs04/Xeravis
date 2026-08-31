import { redirect } from 'next/navigation'

/** Research hub lives at the AI Research Lab; CMS detail docs use /research/[slug]. */
export default function ResearchIndexPage() {
  redirect('/ai-research-lab')
}
