import { JsonLd } from "@/components/layout/json-ld";
import { Contact } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { faqs } from "@/content/faqs";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Tell us about your project. Book a free consultation with GRITZNOVA. We reply within one business day.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <div className="pt-16 sm:pt-20">
        <Contact headingLevel="h1" />
      </div>
      <Faq faqs={faqs.slice(0, 5)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
    </>
  );
}
