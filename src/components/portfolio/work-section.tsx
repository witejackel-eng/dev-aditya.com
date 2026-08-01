import { flagshipProjects, getProject } from "@/data/projects";
import { FlagshipStory } from "@/components/portfolio/flagship-story";
import { Container, Section, SectionLabel, Headline, Lead } from "@/components/site/section";

export function WorkSection() {
  const ibs = getProject("ibs-infra")!;
  const bharat = getProject("bharat-electrosafe")!;
  const device = getProject("device-destination")!;
  const cloud = getProject("cloudsun")!;
  const saffron = getProject("saffron-steam")!;
  const aarohan = getProject("aarohan-legal")!;

  return (
    <Section id="work" className="scroll-mt-20">
      <Container>
        <SectionLabel index="03">Selected work</SectionLabel>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Headline>
              Six projects that prove range without losing focus.
            </Headline>
          </div>
          <div className="lg:col-span-4">
            <Lead>
              Corporate, industrial, commerce, SaaS, brand and professional
              services — each chosen because it demonstrates a different kind of
              judgement. Open any of them for the full case study.
            </Lead>
          </div>
        </div>
      </Container>

      {/* Flagship feature stories: IBS + Bharat */}
      <Container>
        <FlagshipStory project={ibs} index={1} variant="feature" />
        <FlagshipStory project={bharat} index={2} variant="feature" reverse />
      </Container>

      {/* Commerce + product systems pairing */}
      <Container className="py-16 sm:py-20 lg:py-24 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="font-label text-muted-foreground">04</span>
          <span className="font-label text-muted-foreground">
            Commerce &amp; product systems
          </span>
          <span className="h-px flex-1 bg-border" aria-hidden />
        </div>
        <h2 className="mt-4 max-w-3xl font-display text-2xl font-semibold leading-tight text-balance sm:text-3xl">
          He can design and engineer serious digital systems — not just corporate
          websites.
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <FlagshipStory project={device} index={3} variant="pair" />
          <FlagshipStory project={cloud} index={4} variant="pair" />
        </div>
      </Container>

      {/* Creative range pairing */}
      <Container className="py-16 sm:py-20 lg:py-24 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="font-label text-muted-foreground">05</span>
          <span className="font-label text-muted-foreground">
            Creative range
          </span>
          <span className="h-px flex-1 bg-border" aria-hidden />
        </div>
        <h2 className="mt-4 max-w-3xl font-display text-2xl font-semibold leading-tight text-balance sm:text-3xl">
          Sometimes the right design performs. Sometimes it knows when to stay
          quiet.
        </h2>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground text-pretty">
          Saffron &amp; Steam is expressive, atmospheric and motion-led. Aarohan
          Legal is restrained, editorial and compliance-aware. The contrast is
          the point — judgement means knowing which the brief needs.
        </p>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <FlagshipStory project={saffron} index={5} variant="pair" />
          <FlagshipStory project={aarohan} index={6} variant="pair" />
        </div>
      </Container>
    </Section>
  );
}

export { flagshipProjects };
