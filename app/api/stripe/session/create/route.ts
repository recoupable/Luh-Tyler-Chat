import stripeClient from "@/lib/stripe/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const successUrl = body.successUrl;
  const referenceId = body.referenceId;
  const metadata = body.metadata;
  const subscriptionActive = body.subscriptionActive;
  const productName = body.productName;

  const priceData = {
    currency: "usd",
    unit_amount: subscriptionActive ? 2000 : 99, // Removed quotes for numerical values.
    product_data: {
      name: productName,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  if (subscriptionActive)
    priceData.recurring = {
      interval: "month",
      interval_count: 1,
    };

  try {
    const session = await stripeClient.checkout.sessions.create({
      success_url: successUrl as string,
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      mode: subscriptionActive ? "subscription" : "payment",
      client_reference_id: referenceId,
      metadata,
    });

    return Response.json({ data: session }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
