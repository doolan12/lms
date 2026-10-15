import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE, contactLine } from "@/lib/site";

export const metadata: Metadata = { title: `Refunds · ${SITE.name}` };

export default function RefundsPage() {
  return (
    <LegalPage title="Refunds">
      <h2>14-day money-back guarantee</h2>
      <p>
        If {SITE.name} isn&apos;t right for you, ask for a refund within 14 days of buying and we&apos;ll refund you in
        full — no questions asked. To request one, please {contactLine} and include the email address you signed up with.
      </p>
      <p>Refunds go back to the card you paid with, usually within 5–10 business days. Your access ends once refunded.</p>

      <h2>Your consumer rights</h2>
      <p>
        Our services come with guarantees that cannot be excluded under the Australian Consumer Law. If something
        we&apos;ve sold you has a major problem — for example, it doesn&apos;t work or isn&apos;t as described — you&apos;re
        entitled to a refund, even after 14 days.
      </p>
    </LegalPage>
  );
}
