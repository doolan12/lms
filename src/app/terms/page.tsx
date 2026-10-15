import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { SITE, contactLine } from "@/lib/site";

export const metadata: Metadata = { title: `Terms of use · ${SITE.name}` };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use">
      <p>
        These terms apply when you use {SITE.name} (&quot;we&quot;, &quot;us&quot;). By creating an account or buying
        access, you agree to them.
      </p>

      <h2>What {SITE.name} is — and isn&apos;t</h2>
      <p>
        {SITE.name} is an independent online study aid. It helps you learn and practise forklift theory before your
        training and assessment, much like practising for a driver knowledge test.
      </p>
      <ul>
        <li>We are not a Registered Training Organisation (RTO).</li>
        <li>
          We don&apos;t provide nationally recognised training, qualifications, statements of attainment or licences.
        </li>
        <li>We are not affiliated with or endorsed by SafeWork, WorkSafe or any other regulator.</li>
        <li>
          Our questions are our own practice questions. They are not the official assessment, and we don&apos;t use
          confidential assessment material.
        </li>
      </ul>
      <p>
        To get a High Risk Work Licence (class LF), you must complete training and an assessment through an RTO and an
        accredited assessor, then apply to your state or territory regulator.
      </p>

      <h2>Safety information</h2>
      <p>
        Our content is general information to help you learn. It does not replace your training, your workplace&apos;s
        procedures, the manufacturer&apos;s instructions, or directions from your supervisor or trainer. Never operate a
        forklift unless you are licensed (or training under supervision) and authorised to do so.
      </p>

      <h2>No guarantee of passing</h2>
      <p>
        We work hard to make the material accurate and useful, but we can&apos;t guarantee you&apos;ll pass any
        assessment. Laws and standards change, so check anything important with your trainer or regulator.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>Your access is for you only. Please don&apos;t share your login or the course content.</li>
        <li>Keep your password safe and tell us if you think someone else has used your account.</li>
        <li>We may suspend accounts that are shared or misused.</li>
      </ul>

      <h2>Payments and refunds</h2>
      <p>
        Prices are in Australian dollars and include GST where it applies. Payments are processed securely by Stripe. Our{" "}
        <Link href="/refunds" className="underline">refund policy</Link> explains how refunds work.
      </p>

      <h2>Our content</h2>
      <p>
        The lessons, questions, videos and diagrams are our work (photos are credited to their photographers). You may use
        them for your own study, but please don&apos;t copy, resell or republish them.
      </p>

      <h2>Your rights under Australian Consumer Law</h2>
      <p>
        Our services come with guarantees that cannot be excluded under the Australian Consumer Law. Nothing in these terms
        limits those rights. Apart from those rights, and to the extent the law allows, we aren&apos;t liable for any loss
        arising from how you use the information on this site.
      </p>

      <h2>Changes and contact</h2>
      <p>
        We may update these terms from time to time; the date above shows when they last changed. These terms are governed
        by the laws of New South Wales. Questions? Please {contactLine}.
      </p>
    </LegalPage>
  );
}
