import { Reveal } from "@/components/site/reveal";
import { Container } from "@/components/site/section";
import { ArrowRight, ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 paper-grain opacity-50" aria-hidden />
      <Container className="relative py-16 sm:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="font-label text-muted-foreground">
                  Portfolio / Aditya
                </span>
                <span className="h-px w-12 bg-border" aria-hidden />
                <span className="font-label text-muted-foreground">
                  Delhi · Remote
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.04] tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
                I design and build websites that make{" "}
                <span className="text-primary">complicated businesses</span>{" "}
                easier to trust — and easier to choose.
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                Corporate websites, ecommerce platforms and digital products
                shaped around the result your business needs, then engineered to
                work properly after launch.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#work"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  See what changed
                  <ArrowRight className="size-4" aria-hidden />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Bring me the messy version
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-8 font-display text-sm italic text-muted-foreground">
                Designer&apos;s eye. Developer&apos;s hands. Business outcomes in
                the middle.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <Reveal delay={0.15}>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="font-label text-muted-foreground">
                  Range, in one line
                </div>
                <div className="mt-4 space-y-3 font-display text-base">
                  <Row label="Positioning" value="Strategy" />
                  <Row label="Interface" value="Design" />
                  <Row label="Engineering" value="Full-stack delivery" />
                </div>
                <div className="my-5 h-px w-full bg-border" />
                <dl className="grid grid-cols-2 gap-4">
                  <Stat label="Primary case studies" value="6" />
                  <Stat label="Experiments" value="3" />
                </dl>
                <a
                  href="#work"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  <ArrowDown className="size-3.5" aria-hidden />
                  Skip to the work
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-border pb-2">
      <span className="font-label text-xs text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-label text-xs text-muted-foreground">{label}</dt>
      <dd className="font-display text-2xl font-semibold">{value}</dd>
    </div>
  );
}
