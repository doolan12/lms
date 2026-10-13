import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { fulfillCheckoutSession } from "@/lib/enrollment";

export const runtime = "nodejs";

/** Stripe → enrolment. Point a Stripe webhook at /api/stripe/webhook for `checkout.session.completed`. */
export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await request.text(); // raw body is required for signature verification
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await fulfillCheckoutSession(event.data.object as Stripe.Checkout.Session);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handling failed", err);
    // 500 tells Stripe to retry later.
    return NextResponse.json({ error: "Fulfilment failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
