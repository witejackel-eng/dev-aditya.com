import { ContactForm } from "@/components/portfolio/contact-form";
import { Reveal } from "@/components/site/reveal";
import { Container, Section, SectionLabel, Headline } from "@/components/site/section";
import { Mail } from "lucide-react";

export function ContactSection() {
  return (
    <Section id="contact" className="scroll-mt-20 border-t border-border bg-foreground text-background">
      <Container>
        <SectionLabel index="10">
          <span className="text-background/60">Contact</span>
        </SectionLabel>
        <div className="mt-6 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Headline as="h2" className="text-background">
                Have a capable business hiding behind an incapable website?
              </Headline>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-background/70 text-pretty">
                Send me the current site and tell me what the business needs it
                to do better. No perfect brief required — a few honest sentences
                about what is not working is enough to start.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <a
                href="mailto:hello@aditya.dev"
                className="mt-8 inline-flex items-center gap-2 rounded-md border border-background/30 px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-background/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/50"
              >
                <Mail className="size-4" aria-hidden />
                hello@aditya.dev
              </a>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 rounded-lg border border-background/15 p-5">
                <h3 className="font-label text-background/60">What happens next</h3>
                <ol className="mt-3 space-y-2 text-sm text-background/80">
                  <li>1. I read every enquiry personally.</li>
                  <li>2. I reply within a working day or two.</li>
                  <li>3. If it fits, we scope the work together.</li>
                </ol>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="rounded-lg bg-background p-6 text-foreground shadow-xl sm:p-8">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
