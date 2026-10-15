/** Business details shown on the legal pages. Set these in Vercel → Settings → Environment Variables. */
export const SITE = {
  name: "Forklift Theory",
  /** Public contact email, e.g. support@yourdomain.com.au */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  /** Your ABN, once you have one. */
  abn: process.env.NEXT_PUBLIC_ABN || "",
  updated: "15 October 2026",
};

export const contactLine = SITE.contactEmail
  ? `email us at ${SITE.contactEmail}`
  : "reply to the email receipt you received when you paid";
