import "server-only";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

/** Create an enrolment (idempotent). Server-only: uses the service role. */
export async function grantEnrollment(opts: {
  userId: string;
  courseId: string;
  stripeSessionId?: string;
  amountPaidCents?: number;
}) {
  const admin = createAdminClient();
  const { error } = await admin.from("enrollments").upsert(
    {
      user_id: opts.userId,
      course_id: opts.courseId,
      stripe_session_id: opts.stripeSessionId ?? null,
      amount_paid_cents: opts.amountPaidCents ?? 0,
    },
    { onConflict: "user_id,course_id", ignoreDuplicates: true },
  );
  if (error) throw error;
}

/** Has the user completed every lesson in the course? (Gate for the final exam.) */
export async function allLessonsComplete(userId: string, courseId: string) {
  const admin = createAdminClient();
  const { data: lessons } = await admin.from("lessons").select("id").eq("course_id", courseId);
  const ids = (lessons ?? []).map((l) => l.id);
  if (ids.length === 0) return true;
  const { count } = await admin
    .from("lesson_progress")
    .select("lesson_id", { count: "exact", head: true })
    .eq("user_id", userId)
    .in("lesson_id", ids);
  return (count ?? 0) >= ids.length;
}

/** Turn a paid Stripe Checkout Session into an enrolment. Safe to call more than once. */
export async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return false;
  const userId = session.metadata?.user_id;
  const courseId = session.metadata?.course_id;
  if (!userId || !courseId) return false;

  await grantEnrollment({
    userId,
    courseId,
    stripeSessionId: session.id,
    amountPaidCents: session.amount_total ?? 0,
  });
  return true;
}

/**
 * Used on the success redirect so the student gets access immediately,
 * even if the webhook hasn't arrived yet. Only fulfils for the signed-in user.
 */
export async function fulfillCheckoutById(sessionId: string, expectedUserId: string) {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.metadata?.user_id !== expectedUserId) return false;
    return await fulfillCheckoutSession(session);
  } catch {
    return false;
  }
}
