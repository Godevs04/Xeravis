import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { safePayload } from '@/lib/cms'

type FaqDoc = {
  id: string
  question: string
  answer: string
}

type FAQAccordionProps = {
  heading: string
  group?: string | null
}

export async function FAQAccordion({ heading, group }: FAQAccordionProps) {
  const where = group ? { group: { equals: group } } : undefined

  const result = await safePayload((payload) =>
    payload.find({
      collection: 'faqs',
      ...(where ? { where } : {}),
      limit: 20,
    }),
  )

  const faqs = (result?.docs as FaqDoc[]) ?? []

  return (
    <Section>
      <Container className="max-w-3xl">
        <AnimateIn>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
        </AnimateIn>
        {faqs.length === 0 ? (
          <p className="mt-8 text-secondary">FAQs will appear here once published.</p>
        ) : (
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </Container>
    </Section>
  )
}
