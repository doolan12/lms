import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE, contactLine } from "@/lib/site";

export const metadata: Metadata = { title: `Privacy · ${SITE.name}` };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy">
      <p>
        We collect only what we need to run your account and track your learning, and we handle it in line with the
        Australian Privacy Principles.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Your name and email address, and a securely hashed password, when you create an account.</li>
        <li>Your learning progress: lessons completed, quiz answers and scores.</li>
        <li>
          Purchase records (what you bought and when). Card details are handled by Stripe — we never see or store your
          card number.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To give you access, save your progress and show your quiz results.</li>
        <li>To process payments and refunds, and to reply when you contact us.</li>
      </ul>
      <p>We don&apos;t sell your information, and we don&apos;t use advertising trackers.</p>

      <h2>Who helps us run the site</h2>
      <ul>
        <li>Supabase — accounts and learning data (stored in Sydney, Australia).</li>
        <li>Stripe — payments.</li>
        <li>Vercel — website hosting (may process data outside Australia).</li>
        <li>Unsplash — some photos load from Unsplash, which receives standard web request information.</li>
      </ul>
      <p>These providers only use your information to provide their service to us.</p>

      <h2>Your choices</h2>
      <p>
        You can ask to see, correct or delete your information at any time. To do that, or to make a privacy complaint,
        please {contactLine}. If you&apos;re not happy with our response, you can contact the Office of the Australian
        Information Commissioner (oaic.gov.au).
      </p>
    </LegalPage>
  );
}
