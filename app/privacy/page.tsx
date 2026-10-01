import { LegalPage } from "@/components/layout/legal-page";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy policy",
  description: "How GRITZNOVA collects, uses and protects your personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" path="/privacy" updated="[DD Month YYYY]">
      <p>
        {site.legalName} (&quot;GRITZNOVA&quot;, &quot;we&quot;, &quot;us&quot;) respects your
        privacy. This policy explains what personal information we collect through this website, how
        we use it, and your rights.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Information you give us:</strong> your name, email, company, project details and
          budget range when you use our contact form, newsletter sign-up or website assistant.
        </li>
        <li>
          <strong>Chat conversations:</strong> messages you send to our AI assistant (Nova) are
          processed to generate replies. If you share your contact details in the chat, a summary of
          the conversation is sent to our team.
        </li>
        <li>
          <strong>Usage data:</strong> anonymous analytics such as pages visited and device type, if
          analytics are enabled.
        </li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To respond to your enquiry and provide our services.</li>
        <li>To send our newsletter, if you subscribed. You can unsubscribe at any time.</li>
        <li>To improve our website and services.</li>
        <li>To prevent spam and abuse.</li>
      </ul>
      <h2>Third-party processors</h2>
      <p>
        We use trusted providers to run this website, including hosting (Netlify), AI processing for
        the chat assistant (Google Gemini), email delivery and analytics. They process data on our
        behalf under appropriate agreements. [List your actual processors.]
      </p>
      <h2>Retention</h2>
      <p>
        We keep enquiry data only as long as needed for the purposes above, or as required by law.
        [Specify periods.]
      </p>
      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, delete or restrict
        the use of your personal data. To make a request, email{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about this policy? Contact us at{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> or {site.location.address}
        .
      </p>
    </LegalPage>
  );
}
