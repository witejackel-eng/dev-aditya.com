import { Reveal } from "@/components/site/reveal";
import { Container, Section, SectionLabel, Headline, Lead } from "@/components/site/section";
import { TrendingDown, HelpCircle, PenTool, Wrench } from "lucide-react";

const outcomes = [
  {
    icon: TrendingDown,
    situation: "Your website is underselling the business",
    work: [
      "Positioning",
      "Information architecture",
      "Corporate redesign",
      "Credibility systems",
      "Visual direction",
    ],
  },
  {
    icon: HelpCircle,
    situation: "People cannot understand what you sell",
    work: [
      "Product organisation",
      "Service architecture",
      "Comparison tools",
      "Technical content systems",
      "Guided journeys",
    ],
  },
  {
    icon: PenTool,
    situation: "The design exists, but the product needs building",
    work: [
      "Frontend engineering",
      "Design-system implementation",
      "Responsive interfaces",
      "Motion",
      "Accessibility",
    ],
  },
  {
    icon: Wrench,
    situation: "The website needs to do actual work",
    work: [
      "Forms & ecommerce",
      "Payments",
      "Admin tools & dashboards",
      "Databases & integrations",
      "Notifications",
    ],
  },
];

export function Outcomes() {
  return (
    <Section id="outcomes" tone="muted" className="scroll-mt-20">
      <Container>
        <SectionLabel index="07">Outcomes, not services</SectionLabel>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Headline>
              Tell me the situation. I will tell you whether I can help.
            </Headline>
          </div>
          <div className="lg:col-span-5">
            <Lead>
              Most agencies sell services by the yard. This is organised by the
              problem the business actually has — so you can recognise yours and
              see whether the work fits.
            </Lead>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {outcomes.map((o, i) => (
            <Reveal key={o.situation} delay={i * 0.05}>
              <div className="group h-full rounded-lg border border-border bg-card p-6 transition-colors hover:border-foreground/30">
                <div className="flex items-start gap-4">
                  <div className="rounded-md bg-primary/10 p-2.5">
                    <o.icon className="size-5 text-primary" aria-hidden />
                  </div>
                  <h3 className="font-display text-lg font-semibold leading-tight text-balance">
                    {o.situation}
                  </h3>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {o.work.map((w) => (
                    <li
                      key={w}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
                    >
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
