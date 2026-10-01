import { LegalPage } from "@/components/layout/legal-page";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of use",
  description: "The terms that apply when you use the GRITZNOVA website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" path="/terms" updated="[DD Month YYYY]">
      <p>
        These terms govern your use of this website, operated by {site.legalName}. By using the site
        you agree to them.
      </p>
      <h2>Use of the website</h2>
      <p>
        You may use this website for lawful purposes only. Don&apos;t attempt to disrupt it, gain
        unauthorised access or misuse our contact forms or chat assistant.
      </p>
      <h2>AI assistant</h2>
      <p>
        Our website assistant (Nova) uses AI to answer general questions. Its answers are for
        information only and may occasionally be inaccurate. They don&apos;t constitute an offer,
        quote or contract. Any engagement with GRITZNOVA is governed by a separate written
        agreement.
      </p>
      <h2>Intellectual property</h2>
      <p>
        All content on this site, including text, graphics and logos, belongs to GRITZNOVA or its
        licensors unless stated otherwise. Don&apos;t reproduce it without permission.
      </p>
      <h2>No warranty</h2>
      <p>
        The website is provided &quot;as is&quot;. We do our best to keep information accurate but
        make no guarantees. To the extent permitted by law, we aren&apos;t liable for losses arising
        from your use of the site.
      </p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of [Country/State].</p>
      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>
    </LegalPage>
  );
}
