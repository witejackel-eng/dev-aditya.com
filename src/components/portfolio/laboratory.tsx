import { laboratoryProjects } from "@/data/projects";
import { ProjectCover } from "@/components/portfolio/project-cover";
import { Reveal } from "@/components/site/reveal";
import { Container, Section, SectionLabel, Headline, Lead } from "@/components/site/section";
import { ArrowUpRight, Github } from "lucide-react";

export function Laboratory() {
  return (
    <Section id="laboratory" className="scroll-mt-20 border-t border-border">
      <Container>
        <SectionLabel index="Lab">The Useful Experiments Department</SectionLabel>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Headline>
              Built to learn — small on purpose, kept honest.
            </Headline>
          </div>
          <div className="lg:col-span-5">
            <Lead>
              A few experiments that keep the creative and systems instincts
              sharp. They are clearly labelled as experiments, not client work,
              and they never compete with the primary case studies for attention.
            </Lead>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {laboratoryProjects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <article className="flex h-full flex-col rounded-lg border border-border bg-card p-5">
                <ProjectCover project={p} className="aspect-[16/10] w-full" compact />
                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
                    Experiment
                  </span>
                  <span className="font-label text-xs text-muted-foreground">
                    {p.proofRole}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold leading-tight">
                  {p.name}
                </h3>
                <p className="mt-1 font-display text-sm italic text-muted-foreground">
                  {p.outcomeHeadline}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {p.summary}
                </p>
                <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  {p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      Preview
                      <ArrowUpRight className="size-3" aria-hidden />
                      <span className="sr-only">opens in a new tab</span>
                    </a>
                  ) : null}
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    <Github className="size-3" aria-hidden />
                    Code
                    <span className="sr-only">opens in a new tab</span>
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
