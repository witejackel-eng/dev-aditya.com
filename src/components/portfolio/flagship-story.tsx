"use client";

import { useState } from "react";
import { type PortfolioProject, statusLabels } from "@/data/projects";
import { ProjectCover } from "@/components/portfolio/project-cover";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Github,
  Plus,
  Minus,
  ArrowRight,
  Check,
} from "lucide-react";

interface FlagshipStoryProps {
  project: PortfolioProject;
  index: number;
  /** "feature" = large editorial layout; "pair" = paired half-width. */
  variant?: "feature" | "pair";
  reverse?: boolean;
}

export function FlagshipStory({
  project,
  index,
  variant = "feature",
  reverse = false,
}: FlagshipStoryProps) {
  const [open, setOpen] = useState(false);

  return (
    <article
      id={project.slug}
      className={cn("scroll-mt-24", variant === "feature" && "border-b border-border py-16 sm:py-20 lg:py-24")}
    >
      {variant === "feature" ? (
        <div
          className={cn(
            "grid gap-8 lg:grid-cols-12 lg:gap-12",
            reverse ? "lg:[&>*:first-child]:order-2" : "",
          )}
        >
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="font-label text-muted-foreground">
                  {String(index).padStart(2, "0")} / Flagship
                </span>
                <span className="h-px w-10 bg-border" aria-hidden />
                <StatusBadge status={project.status} />
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-3 font-label text-muted-foreground">
                {project.proofRole}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
                {project.outcomeHeadline}
              </h3>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
                {project.summary}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.scope.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  aria-expanded={open}
                  aria-controls={`${project.slug}-detail`}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {open ? (
                    <>
                      <Minus className="size-4" aria-hidden />
                      Close the case study
                    </>
                  ) : (
                    <>
                      View the transformation
                      <ArrowRight className="size-4" aria-hidden />
                    </>
                  )}
                </button>
                <ProjectLinks project={project} />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <ProjectCover project={project} className="aspect-[4/3] w-full shadow-sm" />
            </Reveal>
          </div>
        </div>
      ) : (
        // Paired variant — half width, compact
        <div className="flex h-full flex-col">
          <Reveal>
            <ProjectCover project={project} className="aspect-[16/10] w-full" compact />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-4 flex items-center gap-3">
              <span className="font-label text-muted-foreground">
                {String(index).padStart(2, "0")}
              </span>
              <StatusBadge status={project.status} />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-2 font-label text-muted-foreground">
              {project.proofRole}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <h3 className="mt-2 font-display text-xl font-semibold leading-tight text-balance sm:text-2xl">
              {project.outcomeHeadline}
            </h3>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
              {project.summary}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={`${project.slug}-detail`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                {open ? "Close" : "View the transformation"}
                <ArrowRight className="size-3.5" aria-hidden />
              </button>
              <ProjectLinks project={project} compact />
            </div>
          </Reveal>
        </div>
      )}

      {open ? (
        <CaseStudyDetail project={project} />
      ) : null}
    </article>
  );
}

function CaseStudyDetail({ project }: { project: PortfolioProject }) {
  const cs = project.caseStudy;
  return (
    <div
      id={`${project.slug}-detail`}
      className="mt-10 rounded-lg border border-border bg-card p-6 sm:p-8 lg:p-10"
      role="region"
      aria-label={`${project.name} case study`}
    >
      {/* Disclosure */}
      <div className="flex items-start gap-3 rounded-md border-l-2 border-primary bg-primary/5 p-4">
        <span className="font-label mt-0.5 text-primary">Status</span>
        <p className="text-sm text-muted-foreground">{cs.disclosure}</p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        {/* Main narrative */}
        <div className="lg:col-span-7 space-y-8">
          <Block heading="The business problem" index="01">
            <p className="text-base leading-relaxed text-foreground/90 text-pretty">
              {cs.businessProblem}
            </p>
          </Block>

          <Block heading="Constraints that shaped it" index="02">
            <ul className="space-y-2">
              {cs.constraints.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block heading="Strategy" index="03">
            <ul className="space-y-3">
              {cs.strategy.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm text-foreground/90">
                  <span className="font-label mt-0.5 text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block heading="What changed" index="04">
            <ul className="space-y-2">
              {cs.intervention.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block heading="Why it matters" index="05">
            <p className="text-base leading-relaxed text-foreground/90 text-pretty">
              {cs.outcome}
            </p>
          </Block>
        </div>

        {/* Sidebar: evidence + meta + engineering */}
        <div className="lg:col-span-5 space-y-8">
          <Block heading="Evidence" index="06">
            <dl className="divide-y divide-border rounded-md border border-border">
              {cs.evidence.map((e) => (
                <div key={e.label} className="flex items-baseline justify-between gap-4 p-3">
                  <dt className="text-xs text-muted-foreground">{e.label}</dt>
                  <dd className="text-right text-sm font-medium">{e.detail}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block heading="Project meta">
            <dl className="space-y-2 text-sm">
              <Meta label="Role" value={project.role} />
              <Meta label="Industry" value={project.industry} />
              <Meta label="Type" value={project.projectType} />
              <Meta label="Status" value={statusLabels[project.status]} />
            </dl>
          </Block>

          <details className="group rounded-md border border-border">
            <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Engineering notes
              <Plus className="size-4 transition-transform group-open:rotate-45" aria-hidden />
            </summary>
            <ul className="space-y-2 border-t border-border p-4">
              {cs.engineeringNotes.map((n) => (
                <li key={n} className="text-xs leading-relaxed text-muted-foreground">
                  {n}
                </li>
              ))}
              <li className="pt-2 text-xs text-muted-foreground">
                Stack: {project.technology.join(" · ")}
              </li>
            </ul>
          </details>
        </div>
      </div>

      {/* Contextual CTA */}
      <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
        <p className="font-display text-xl font-semibold text-balance sm:text-2xl">
          {project.contextualCta.question}
        </p>
        <a
          href="#contact"
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
        >
          {project.contextualCta.button}
          <ArrowRight className="size-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}

function Block({
  heading,
  index,
  children,
}: {
  heading: string;
  index?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        {index ? (
          <span className="font-label text-muted-foreground">{index}</span>
        ) : null}
        <h4 className="font-label text-foreground">{heading}</h4>
        <span className="h-px flex-1 bg-border" aria-hidden />
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-border pb-1.5">
      <dt className="font-label text-xs text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: PortfolioProject["status"] }) {
  const styles: Record<PortfolioProject["status"], string> = {
    client: "border-primary/30 bg-primary/10 text-primary",
    business: "border-primary/30 bg-primary/10 text-primary",
    concept: "border-accent/40 bg-accent/15 text-accent-foreground",
    experiment: "border-border bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

function ProjectLinks({
  project,
  compact = false,
}: {
  project: PortfolioProject;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", compact && "text-xs")}>
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {project.liveLabel ?? "Live site"}
          <ArrowUpRight className="size-3.5" aria-hidden />
          <span className="sr-only">opens in a new tab</span>
        </a>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
          No live link
        </span>
      )}
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Github className="size-3.5" aria-hidden />
        Code
        <span className="sr-only">opens in a new tab</span>
      </a>
    </div>
  );
}
