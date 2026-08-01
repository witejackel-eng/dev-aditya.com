import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Editorial section wrapper with consistent rhythm. */
export function Section({
  id,
  children,
  className,
  tone = "default",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "maroon" | "ink" | "muted";
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 py-16 sm:py-20 lg:py-28",
        tone === "maroon" && "bg-primary text-primary-foreground",
        tone === "ink" && "bg-foreground text-background",
        tone === "muted" && "bg-muted/50",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Max-width container. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

/** Brutalist mono label, e.g. "01 / Hero". */
export function SectionLabel({
  children,
  index,
  className,
}: {
  children: ReactNode;
  index?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {index ? (
        <span className="font-label text-muted-foreground">{index}</span>
      ) : null}
      <span className="font-label text-muted-foreground">{children}</span>
      <span className="h-px flex-1 bg-border" aria-hidden />
    </div>
  );
}

/** Large editorial headline using the serif display face. */
export function Headline({
  children,
  className,
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "font-display font-semibold tracking-tight text-balance",
        Tag === "h1" && "text-4xl leading-[1.05] sm:text-5xl lg:text-6xl",
        Tag === "h2" && "text-3xl leading-[1.1] sm:text-4xl lg:text-5xl",
        Tag === "h3" && "text-2xl leading-tight sm:text-3xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Body lead paragraph. */
export function Lead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty",
        className,
      )}
    >
      {children}
    </p>
  );
}
