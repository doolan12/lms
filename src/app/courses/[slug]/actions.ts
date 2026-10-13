"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { grantEnrollment } from "@/lib/enrollment";
import { getStripe } from "@/lib/stripe";

/** "Enrol" button: free courses enrol straight away, paid courses go to Stripe Checkout. */
export async function startEnrollment(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?mode=signup&next=${encodeURIComponent(`/courses/${slug}`)}`);

  const { data: course } = await supabase
    .from("courses")
    .select("id, slug, title, summary, price_cents, currency")
    .eq("slug", slug)
    .maybeSingle();
  if (!course) redirect("/");

  const { data: existing } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .maybeSingle();
  if (existing) redirect(`/courses/${slug}`);

  if (course.price_cents === 0) {
    await grantEnrollment({ userId: user.id, courseId: course.id });
    revalidatePath(`/courses/${slug}`);
    redirect(`/courses/${slug}`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: { user_id: user.id, course_id: course.id },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: course.currency,
          unit_amount: course.price_cents,
          product_data: { name: course.title, description: course.summary || undefined },
        },
      },
    ],
    success_url: `${siteUrl}/courses/${slug}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/courses/${slug}?checkout=cancelled`,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  redirect(session.url);
}

/** Toggle a lesson's completion for the signed-in student. RLS ensures they're enrolled. */
export async function setLessonComplete(formData: FormData) {
  const lessonId = String(formData.get("lessonId") ?? "");
  const complete = formData.get("complete") === "true";
  const path = String(formData.get("path") ?? "/dashboard");
  const goTo = formData.get("goTo");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (complete) {
    await supabase
      .from("lesson_progress")
      .upsert({ user_id: user.id, lesson_id: lessonId }, { onConflict: "user_id,lesson_id", ignoreDuplicates: true });
  } else {
    await supabase.from("lesson_progress").delete().eq("user_id", user.id).eq("lesson_id", lessonId);
  }

  revalidatePath(path);
  if (typeof goTo === "string" && goTo.startsWith("/")) redirect(goTo);
}
