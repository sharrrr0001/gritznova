import { JsonLd } from "@/components/layout/json-ld";
import { Contact } from "@/components/sections/contact";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { FeaturedWork } from "@/components/sections/featured-work";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { ServicesGrid } from "@/components/sections/services-grid";
import { Stats } from "@/components/sections/stats";
import { TechStack } from "@/components/sections/tech-stack";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustedBy } from "@/components/sections/trusted-by";
import { WhyUs } from "@/components/sections/why-us";
import { faqs } from "@/content/faqs";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <ServicesGrid />
      <WhyUs />
      <FeaturedWork />
      <Process />
      <TechStack />
      <Stats />
      <Testimonials />
      <Faq faqs={faqs} />
      <CtaBand />
      <Contact />
      <JsonLd data={faqJsonLd(faqs)} />
    </>
  );
}
