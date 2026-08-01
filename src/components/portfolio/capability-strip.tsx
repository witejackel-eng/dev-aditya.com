import { Reveal } from "@/components/site/reveal";
import { Container, SectionLabel } from "@/components/site/section";
import { Building2, ShoppingCart, LayoutDashboard, Sparkles } from "lucide-react";

const capabilities = [
  {
    icon: Building2,
    title: "Corporate & industrial websites",
    detail:
      "Service businesses, manufacturers and professional firms — reorganised so a serious buyer can follow the journey.",
  },
  {
    icon: ShoppingCart,
    title: "Ecommerce & buying systems",
    detail:
      "Discovery, comparison, checkout and payments engineered to survive the operational edge cases that lose money.",
  },
  {
    icon: LayoutDashboard,
    title: "SaaS & operational interfaces",
    detail:
      "Dense, role-based workspaces designed for people who use the software eight hours a day, not once.",
  },
  {
    icon: Sparkles,
    title: "Interactive brand experiences",
    detail:
      "Art direction, motion and WebGL used to sell atmosphere — without punishing mobile or low-power visitors.",
  },
];

export function CapabilityStrip() {
  return (
    <section id="capabilities" className="border-b border-border bg-muted/40 scroll-mt-20">
      <Container className="py-12 sm:py-16">
        <SectionLabel index="02">Capability proof</SectionLabel>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <div className="group h-full rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/30">
                <c.icon className="size-6 text-primary" aria-hidden />
                <h3 className="mt-4 font-display text-base font-semibold leading-tight">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {c.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
