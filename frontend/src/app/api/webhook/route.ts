import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    const rawBody = await req.text(); // Lấy raw body của request
    event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Kiểm tra nếu là sự kiện thanh toán thành công
  //   if (event.type === "payment_intent.succeeded") {
  //     const paymentIntent = event.data.object as Stripe.PaymentIntent;
  //     const cartItems = JSON.parse(paymentIntent.metadata.cartItems);

  //     // Cập nhật trạng thái đơn hàng trong database
  //     await Order.findOneAndUpdate(
  //       { paymentIntentId: paymentIntent.id },
  //       { status: "paid" }
  //     );
  //   }

  return NextResponse.json({ received: true });
}
