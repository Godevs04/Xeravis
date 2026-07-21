import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/RichText'
import { AnimateIn } from '@/components/motion/AnimateIn'

type RichTextBlockProps = {
  content: unknown
}

export function RichTextBlock({ content }: RichTextBlockProps) {
  return (
    <Section>
      <Container className="max-w-3xl">
        <AnimateIn>
          <RichText content={content as Parameters<typeof RichText>[0]['content']} />
        </AnimateIn>
      </Container>
    </Section>
  )
}
