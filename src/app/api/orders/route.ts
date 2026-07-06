import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { validateRequest, apiError, apiSuccess } from "@/lib/api-utils";
import { orderSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return apiError("Unauthorized", 401);

    const user = session.user as Record<string, unknown>;
    const isAdmin = user.role === "admin";

    const orders = await db.query.orders.findMany({
      where: isAdmin ? undefined : eq(schema.orders.userId, session.user.id),
      with: { items: true },
      orderBy: [desc(schema.orders.createdAt)],
    });
    return apiSuccess(orders);
  } catch {
    return apiError("Failed to fetch orders", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return apiError("Unauthorized", 401);

    const body = await req.json();
    const validation = validateRequest(orderSchema, body);
    if (!validation.success) return apiError(validation.error);

    const orderId = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const estimatedDelivery = new Date(Date.now() + 35 * 60000);
    const d = validation.data;

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
      estimatedDelivery,
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

    return apiSuccess(order[0], 201);
  } catch {
    return apiError("Failed to create order", 500);
  }
}
