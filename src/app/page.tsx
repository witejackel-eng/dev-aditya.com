import { Hero } from "@/components/portfolio/hero";
import { CapabilityStrip } from "@/components/portfolio/capability-strip";
import { WorkSection } from "@/components/portfolio/work-section";
import { Outcomes } from "@/components/portfolio/outcomes";
import { Process } from "@/components/portfolio/process";
import { About } from "@/components/portfolio/about";
import { Laboratory } from "@/components/portfolio/laboratory";
import { ContactSection } from "@/components/portfolio/contact-section";

export default function Home() {
  return (
    <>
      <Hero />
      <CapabilityStrip />
      <WorkSection />
      <Outcomes />
      <Process />
      <About />
      <Laboratory />
      <ContactSection />

      {/* Honest structured data — no fabricated reviews or organisations. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Aditya",
            jobTitle: "Designer & Developer",
            description:
              "Designer and developer for business websites, ecommerce platforms and digital products.",
            url: "https://aditya.dev",
            email: "hello@aditya.dev",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Delhi",
              addressCountry: "IN",
            },
            knowsAbout: [
              "Corporate website design",
              "Ecommerce engineering",
              "SaaS product design",
              "Information architecture",
              "Brand experience design",
            ],
          }),
        }}
      />
    </>
  );
}
