import { Reveal } from "@/components/site/reveal";
import { Container, Section, SectionLabel, Headline, Lead } from "@/components/site/section";
import { MapPin, Mail, Clock, Github } from "lucide-react";

export function About() {
  return (
    <Section id="about" tone="muted" className="scroll-mt-20">
      <Container>
        <SectionLabel index="09">About</SectionLabel>
        <div className="mt-6 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Headline>
                A designer and developer who takes the project from the problem
                to the deploy.
              </Headline>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground text-pretty">
                <p>
                  I am Aditya. I work on corporate websites, ecommerce platforms,
                  operational software and interactive brand experiences —
                  combining strategy, visual design and production-grade
                  development so the business gets an outcome, not a deliverable.
                </p>
                <p>
                  I prefer projects where the business is genuinely complicated:
                  too many services, technical products, regulated industries,
                  operational density. That is where design judgement and
                  engineering rigour actually pay for themselves.
                </p>
                <p>
                  I do not lead with frameworks. The work is judged by whether
                  the site makes the business easier to understand, trust and
                  choose — and whether it keeps working after launch.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-label text-muted-foreground">Profile</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <Fact icon={MapPin} label="Based in" value="Delhi, India" />
                  <Fact icon={Clock} label="Working" value="Remotely, worldwide" />
                  <Fact icon={Mail} label="Direct" value="hello@aditya.dev" />
                  <Fact icon={Github} label="Code" value="github.com/witejackel-eng" />
                </dl>
                <div className="my-5 h-px w-full bg-border" />
                <h3 className="font-label text-muted-foreground">Experience across</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  <li>B2B & industrial corporate websites</li>
                  <li>Ecommerce and full-stack buying systems</li>
                  <li>SaaS and operational product design</li>
                  <li>Editorial and interactive brand experiences</li>
                </ul>
                <div className="my-5 h-px w-full bg-border" />
                <p className="font-display text-sm italic text-muted-foreground">
                  Selected availability. I take on a small number of projects so
                  each one gets the attention it needs.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-4 shrink-0 text-primary" aria-hidden />
      <dt className="font-label text-xs text-muted-foreground">{label}</dt>
      <dd className="ml-auto font-medium">{value}</dd>
    </div>
  );
}
