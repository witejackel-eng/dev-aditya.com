import Link from "next/link";
import { Github, Mail, ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block size-2.5 rounded-full bg-primary"
              />
              <span className="font-display text-lg font-semibold tracking-tight">
                Aditya
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Designer and developer for business websites, ecommerce platforms
              and digital products. Based in Delhi, working remotely.
            </p>
            <a
              href="mailto:hello@aditya.dev"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              <Mail className="size-4" aria-hidden />
              hello@aditya.dev
            </a>
          </div>

          <nav className="md:col-span-3" aria-label="Footer">
            <h2 className="font-label text-muted-foreground">Navigate</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#work" className="text-foreground/80 hover:text-foreground">
                  Work
                </Link>
              </li>
              <li>
                <Link href="#capabilities" className="text-foreground/80 hover:text-foreground">
                  Capabilities
                </Link>
              </li>
              <li>
                <Link href="#process" className="text-foreground/80 hover:text-foreground">
                  Process
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-foreground/80 hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-foreground/80 hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="md:col-span-4" aria-label="Elsewhere">
            <h2 className="font-label text-muted-foreground">Elsewhere</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/witejackel-eng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground"
                >
                  <Github className="size-4" aria-hidden />
                  GitHub
                  <ArrowUpRight className="size-3 text-muted-foreground" aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@aditya.dev"
                  className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground"
                >
                  <Mail className="size-4" aria-hidden />
                  Direct email
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {year} Aditya. Built deliberately, not from a template.</p>
          <p className="font-label">Designer&apos;s eye · Developer&apos;s hands</p>
        </div>
      </div>
    </footer>
  );
}
