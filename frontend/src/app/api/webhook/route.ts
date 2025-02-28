import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    const rawBody = await req.text(); // Lấy raw body của request
    event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret);
    console.log("Webhook event received:", event.type); // Sử dụng event.type
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Kiểm tra nếu là sự kiện thanh toán thành công
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const cartItems = JSON.parse(paymentIntent.metadata.cartItems);

    // Cập nhật trạng thái đơn hàng trong database (giả định có Order model)
    // await Order.findOneAndUpdate(
    //   { paymentIntentId: paymentIntent.id },
    //   { status: "paid" }
    // );
    console.log("Payment succeeded, cart items:", cartItems);
  }

  return NextResponse.json({ received: true });
}
