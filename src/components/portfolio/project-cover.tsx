import { type PortfolioProject } from "@/data/projects";
import { cn } from "@/lib/utils";

const accentClasses: Record<PortfolioProject["accent"], string> = {
  maroon: "bg-primary text-primary-foreground",
  ochre: "bg-accent text-accent-foreground",
  ink: "bg-foreground text-background",
  sand: "bg-secondary text-secondary-foreground",
};

const accentLine: Record<PortfolioProject["accent"], string> = {
  maroon: "bg-primary",
  ochre: "bg-accent",
  ink: "bg-foreground",
  sand: "bg-secondary-foreground/60",
};

/**
 * Honest, designed cover per project. Each motif is an abstract architectural
 * representation of the project's structure — not a fake screenshot. This keeps
 * the portfolio visually strong without inventing interfaces that do not exist.
 */
export function ProjectCover({
  project,
  className,
  compact = false,
}: {
  project: PortfolioProject;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border",
        accentClasses[project.accent],
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 paper-grain opacity-40" />
      <Motif project={project} compact={compact} />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
        <div>
          <div className="font-label opacity-70">{project.industry}</div>
          <div className="font-display text-xl font-semibold leading-tight sm:text-2xl">
            {project.name}
          </div>
        </div>
        <span className="font-label opacity-60">
          {String(project.featuredRank).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

function Motif({
  project,
  compact,
}: {
  project: PortfolioProject;
  compact: boolean;
}) {
  const line = accentLine[project.accent];

  switch (project.motif) {
    case "taxonomy":
      return <TaxonomyMotif line={line} compact={compact} />;
    case "grid-compare":
      return <GridCompareMotif line={line} compact={compact} />;
    case "checkout-flow":
      return <CheckoutMotif line={line} compact={compact} />;
    case "routes":
      return <RoutesMotif line={line} compact={compact} />;
    case "steam":
      return <SteamMotif compact={compact} />;
    case "restraint":
      return <RestraintMotif compact={compact} />;
    case "editorial-lux":
      return <EditorialLuxMotif line={line} compact={compact} />;
    case "data-grid":
      return <DataGridMotif line={line} compact={compact} />;
    case "signal":
      return <SignalMotif compact={compact} />;
    default:
      return null;
  }
}

/* ── IBS Infra — service taxonomy tree ── */
function TaxonomyMotif({ line, compact }: { line: string; compact: boolean }) {
  const divisions = ["Comm", "AV", "Network", "Fire", "Security", "Call ctr"];
  return (
    <div className={cn("flex flex-col gap-4 p-5", compact ? "h-40" : "h-56")}>
      <div className="flex items-center gap-2">
        <span className="size-3 rounded-sm bg-current opacity-90" />
        <span className="font-label opacity-80">IBS / services</span>
      </div>
      <div className={cn("h-px w-full", line)} />
      <div className="grid flex-1 grid-cols-6 gap-1.5">
        {divisions.map((d) => (
          <div key={d} className="flex flex-col gap-1.5">
            <div className="rounded-sm bg-current/85 px-1.5 py-1 text-[0.6rem] font-medium leading-tight">
              {d}
            </div>
            <div className="space-y-1">
              <div className="h-1.5 rounded-sm bg-current/40" />
              <div className="h-1.5 w-3/4 rounded-sm bg-current/40" />
              <div className="h-1.5 w-1/2 rounded-sm bg-current/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Bharat Electrosafe — product comparison grid ── */
function GridCompareMotif({ compact }: { line: string; compact: boolean }) {
  const rows = ["Family", "Rating", "Cert.", "Spec", "Datasheet"];
  return (
    <div className={cn("p-5", compact ? "h-40" : "h-56")}>
      <div className="font-label opacity-70">Product comparison</div>
      <div className="mt-4 grid grid-cols-4 gap-0 overflow-hidden rounded-sm border border-current/20">
        <div className="bg-current/15 p-2 text-[0.6rem] font-medium">Attribute</div>
        <div className="bg-current/10 p-2 text-[0.6rem] font-medium">Variant A</div>
        <div className="bg-current/10 p-2 text-[0.6rem] font-medium">Variant B</div>
        <div className="bg-current/10 p-2 text-[0.6rem] font-medium">Variant C</div>
        {rows.map((r) => (
          <div key={r} className="contents">
            <div className="border-t border-current/15 bg-current/15 p-2 text-[0.6rem]">
              {r}
            </div>
            <div className="border-t border-current/15 p-2 text-[0.6rem] opacity-70">
              ——
            </div>
            <div className="border-t border-current/15 p-2 text-[0.6rem] opacity-70">
              ——
            </div>
            <div className="border-t border-current/15 p-2 text-[0.6rem] opacity-70">
              ——
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── DeviceDestination — checkout saga ── */
function CheckoutMotif({ line, compact }: { line: string; compact: boolean }) {
  const steps = ["Search", "Compare", "Cart", "Pay", "Verify", "Invoice"];
  return (
    <div className={cn("flex flex-col justify-center p-5", compact ? "h-40" : "h-56")}>
      <div className="font-label opacity-70">Checkout saga</div>
      <div className="mt-5 flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-1">
            <div className="flex-1">
              <div className="rounded-sm bg-current/85 px-1.5 py-1 text-center text-[0.55rem] font-medium leading-tight">
                {s}
              </div>
            </div>
            {i < steps.length - 1 ? (
              <span className={cn("h-0.5 w-2 shrink-0", line)} />
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-[0.6rem] opacity-70">
        <span className="size-2 rounded-full bg-current" />
        <span>idempotent · reconcilable · webhook-safe</span>
      </div>
    </div>
  );
}

/* ── CloudSun — 24-route map ── */
function RoutesMotif({ compact }: { line: string; compact: boolean }) {
  const routes = Array.from({ length: 24 });
  return (
    <div className={cn("p-5", compact ? "h-40" : "h-56")}>
      <div className="flex items-center justify-between">
        <div className="font-label opacity-70">24 routes · 3 roles</div>
        <div className="font-label opacity-50">workspace</div>
      </div>
      <div className="mt-4 grid grid-cols-8 gap-1.5">
        {routes.map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-sm bg-current"
            style={{ opacity: 0.25 + ((i * 37) % 70) / 100 }}
          />
        ))}
      </div>
      <div className="mt-3 flex gap-1.5 text-[0.55rem] opacity-70">
        <span className="rounded-sm bg-current/80 px-1.5 py-0.5">agent</span>
        <span className="rounded-sm bg-current/50 px-1.5 py-0.5">supervisor</span>
        <span className="rounded-sm bg-current/30 px-1.5 py-0.5">admin</span>
      </div>
    </div>
  );
}

/* ── Saffron & Steam — atmospheric steam ── */
function SteamMotif({ compact }: { compact: boolean }) {
  return (
    <div className={cn("relative p-5", compact ? "h-40" : "h-56")}>
      <div className="font-label opacity-70">Atmosphere first</div>
      <svg
        viewBox="0 0 320 160"
        className="absolute inset-x-5 bottom-4 w-[calc(100%-2.5rem)]"
        preserveAspectRatio="none"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M 0 ${80 + i * 14} C 60 ${60 + i * 14}, 120 ${100 + i * 14}, 160 ${78 + i * 14} S 280 ${90 + i * 14}, 320 ${70 + i * 14}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity={0.65 - i * 0.1}
          />
        ))}
      </svg>
    </div>
  );
}

/* ── Aarohan Legal — restrained type lockup ── */
function RestraintMotif({ compact }: { compact: boolean }) {
  return (
    <div className={cn("flex flex-col justify-center p-5", compact ? "h-40" : "h-56")}>
      <div className="font-label opacity-60">Practice areas</div>
      <div className="mt-3 space-y-1.5 font-display text-sm leading-tight opacity-90">
        <div>01 — Corporate & commercial</div>
        <div>02 — Dispute resolution</div>
        <div>03 — Contracts & advisory</div>
        <div className="opacity-50">04 — …</div>
      </div>
      <div className="mt-4 h-px w-2/3 bg-current/40" />
    </div>
  );
}

/* ── Casa Aurelia — editorial luxury ── */
function EditorialLuxMotif({ line, compact }: { line: string; compact: boolean }) {
  return (
    <div className={cn("p-5", compact ? "h-40" : "h-56")}>
      <div className="font-label opacity-70">Atelier — no portal</div>
      <div className="mt-4 grid grid-cols-5 gap-3">
        <div className="col-span-3 flex flex-col justify-end">
          <div className="font-display text-2xl leading-none opacity-90">
            Casa
            <br />
            Aurelia
          </div>
        </div>
        <div className="col-span-2 space-y-1.5">
          <div className={cn("h-16 w-full rounded-sm", line)} />
          <div className="h-1.5 w-full rounded-sm bg-current/40" />
          <div className="h-1.5 w-2/3 rounded-sm bg-current/40" />
        </div>
      </div>
    </div>
  );
}

/* ── PricePilot — data grid ── */
function DataGridMotif({ compact }: { line: string; compact: boolean }) {
  return (
    <div className={cn("p-5", compact ? "h-40" : "h-56")}>
      <div className="font-label opacity-70">Decision support</div>
      <div className="mt-3 space-y-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="h-2 w-16 rounded-sm bg-current/50" />
            <div className="flex-1">
              <div className="h-2 rounded-sm bg-current" style={{ opacity: 0.25 + i * 0.13 }} />
            </div>
            <div className="h-2 w-8 rounded-sm bg-current/40" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── DUST//SIGNAL — signal waveform ── */
function SignalMotif({ compact }: { compact: boolean }) {
  return (
    <div className={cn("relative p-5", compact ? "h-40" : "h-56")}>
      <div className="font-label opacity-70">Generative signal</div>
      <svg
        viewBox="0 0 320 120"
        className="absolute inset-x-5 bottom-5 w-[calc(100%-2.5rem)]"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 60 L 20 60 L 24 30 L 28 90 L 32 60 L 60 60 L 64 20 L 68 100 L 72 60 L 110 60 L 114 40 L 118 80 L 122 60 L 160 60 L 164 10 L 168 110 L 172 60 L 220 60 L 224 35 L 228 85 L 232 60 L 280 60 L 284 45 L 288 75 L 292 60 L 320 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}
