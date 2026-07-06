import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { validateRequest, apiError, apiSuccess } from "@/lib/api-utils";
import { orderSchema } from "@/lib/validators";
import { db, schema } from "@/lib/db";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-06-24.dahlia" });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return apiError("Unauthorized", 401);

    const body = await req.json();
    const validation = validateRequest(orderSchema, body);
    if (!validation.success) return apiError(validation.error);

    const orderId = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const d = validation.data;

    if (d.paymentMethod === "stripe") {
      const paymentIntent = await getStripe().paymentIntents.create({
        amount: Math.round(d.total * 100),
        currency: "usd",
        metadata: { orderId, userId: session.user.id },
      });

      const order = await db.insert(schema.orders).values({
        id: orderId,
        userId: session.user.id,
        subtotal: String(d.subtotal),
        discount: String(d.discount),
        delivery: String(d.delivery),
        tax: String(d.tax),
        total: String(d.total),
        deliveryMethod: d.deliveryMethod,
        paymentMethod: d.paymentMethod,
        addressId: d.addressId || null,
        couponCode: d.couponCode || null,
        notes: d.notes || null,
        stripePaymentIntentId: paymentIntent.id,
        estimatedDelivery: new Date(Date.now() + 35 * 60000),
      }).returning();

      if (order.length && d.items.length) {
        await db.insert(schema.orderItems).values(
          d.items.map((item) => ({
            id: `oi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            orderId: order[0].id,
            menuItemId: item.menuItemId,
            name: item.name,
            price: String(item.price),
            quantity: item.quantity,
            image: item.image,
          }))
        );
      }

      return apiSuccess({ orderId, clientSecret: paymentIntent.client_secret });
    }

    const order = await db.insert(schema.orders).values({
      id: orderId,
      userId: session.user.id,
      subtotal: String(d.subtotal),
      discount: String(d.discount),
      delivery: String(d.delivery),
      tax: String(d.tax),
      total: String(d.total),
      deliveryMethod: d.deliveryMethod,
      paymentMethod: d.paymentMethod,
      addressId: d.addressId || null,
      couponCode: d.couponCode || null,
      notes: d.notes || null,
      estimatedDelivery: new Date(Date.now() + 35 * 60000),
    }).returning();

    if (order.length && d.items.length) {
      await db.insert(schema.orderItems).values(
        d.items.map((item) => ({
          id: `oi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          orderId: order[0].id,
          menuItemId: item.menuItemId,
          name: item.name,
          price: String(item.price),
          quantity: item.quantity,
          image: item.image,
        }))
      );
    }

    return apiSuccess({ orderId, success: true });
  } catch {
    return apiError("Failed to process checkout", 500);
  }
}
