import { Reveal } from "@/components/site/reveal";
import { Container, Section, SectionLabel, Headline, Lead } from "@/components/site/section";

const steps = [
  {
    n: "01",
    title: "Understand the business and failure points",
    detail:
      "Before any design: what the business sells, who buys it, where the current site loses them, and what a win actually looks like.",
  },
  {
    n: "02",
    title: "Structure the journey and content",
    detail:
      "Information architecture, content grouping and conversion path — decided on paper before any screen is drawn.",
  },
  {
    n: "03",
    title: "Establish the design direction",
    detail:
      "Typography, hierarchy, motion rules and visual language that fit the business, not the trend cycle.",
  },
  {
    n: "04",
    title: "Build in a working environment",
    detail:
      "Production-grade code from the start. What you see in the preview is what ships — no throwaway mockups.",
  },
  {
    n: "05",
    title: "Test real screens and interactions",
    detail:
      "Responsive checks across real device widths, keyboard use, reduced motion, forms, links and error states.",
  },
  {
    n: "06",
    title: "Launch, document and hand over",
    detail:
      "Deployment, documentation and a handover that lets the team maintain the site without filing engineering tickets.",
  },
];

export function Process() {
  return (
    <Section id="process" className="scroll-mt-20">
      <Container>
        <SectionLabel index="08">Working relationship</SectionLabel>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Headline>
              No relay race between strategist, designer and developer.
            </Headline>
          </div>
          <div className="lg:col-span-5">
            <Lead>
              You work directly with the person responsible for understanding the
              problem, structuring the experience, designing the interface,
              building the system, and testing it. One pair of hands, start to
              finish.
            </Lead>
          </div>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.04}>
              <li className="h-full rounded-lg border border-border bg-card p-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-semibold text-primary">
                    {s.n}
                  </span>
                  <span className="h-px flex-1 bg-border" aria-hidden />
                </div>
                <h3 className="mt-3 font-display text-base font-semibold leading-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.detail}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
