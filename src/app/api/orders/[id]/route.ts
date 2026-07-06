import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "preparing", "ready", "out-for-delivery", "delivered", "cancelled"]),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await db.query.orders.findFirst({
      where: eq(schema.orders.id, id),
      with: { items: true },
    });
    if (!order) return apiError("Order not found", 404);
    return apiSuccess(order);
  } catch {
    return apiError("Failed to fetch order", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return apiError("Unauthorized", 401);

    const { id } = await params;
    const body = await req.json();
    const user = session.user as Record<string, unknown>;

    const order = await db.query.orders.findFirst({ where: eq(schema.orders.id, id) });
    if (!order) return apiError("Order not found", 404);

    if (user.role !== "admin" && order.userId !== session.user.id) {
      return apiError("Forbidden", 403);
    }

    const validation = statusSchema.partial().safeParse(body);
    if (!validation.success) return apiError("Invalid status");

    const updated = await db.update(schema.orders)
      .set({ ...validation.data, updatedAt: new Date() })
      .where(eq(schema.orders.id, id))
      .returning();

    return apiSuccess(updated[0]);
  } catch {
    return apiError("Failed to update order", 500);
  }
}
