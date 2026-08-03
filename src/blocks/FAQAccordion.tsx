import { JsonLd } from '@/components/seo/JsonLd'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { safePayload } from '@/lib/cms'
import { faqPageJsonLd } from '@/lib/seo'
import { DEFAULT_SERVICE_FAQS, type FaqItem } from '@/lib/seo-content'

type FaqDoc = {
  id: string
  question: string
  answer: string
}

type FAQAccordionProps = {
  heading: string
  group?: string | null
  /** Extra FAQs merged ahead of CMS results (AEO defaults). */
  seedFaqs?: FaqItem[]
}

export async function FAQAccordion({ heading, group, seedFaqs }: FAQAccordionProps) {
  const where = group ? { group: { equals: group } } : undefined

  const result = await safePayload((payload) =>
    payload.find({
      collection: 'faqs',
      ...(where ? { where } : {}),
      limit: 20,
    }),
  )

  const cmsFaqs = ((result?.docs as FaqDoc[]) ?? []).map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }))

  const seeded = (seedFaqs?.length ? seedFaqs : cmsFaqs.length ? [] : DEFAULT_SERVICE_FAQS).map(
    (faq, index) => ({
      id: `seed-${index}`,
      question: faq.question,
      answer: faq.answer,
    }),
  )

  const faqs = [...seeded, ...cmsFaqs]
  const schema = faqPageJsonLd(faqs.map(({ question, answer }) => ({ question, answer })))

  return (
    <Section>
      {schema ? <JsonLd id="faq-jsonld" data={schema} /> : null}
      <Container className="max-w-3xl">
        <AnimateIn>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
        </AnimateIn>
        {faqs.length === 0 ? (
          <p className="text-secondary mt-8">FAQs will appear here once published.</p>
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
