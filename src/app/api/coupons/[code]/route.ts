import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || (session.user as Record<string, unknown>).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { code } = await params;
    const body = await req.json();

    const updateData: Record<string, unknown> = {};
    if (body.discount !== undefined) updateData.discount = String(body.discount);
    if (body.type !== undefined) updateData.type = body.type;
    if (body.minOrder !== undefined) updateData.minOrder = String(body.minOrder);
    if (body.active !== undefined) updateData.active = body.active;
    if (body.usageLimit !== undefined) updateData.usageLimit = body.usageLimit;
    if (body.expiresAt !== undefined) updateData.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

    const updated = await db.update(schema.coupons)
      .set(updateData)
      .where(eq(schema.coupons.code, code.toUpperCase()))
      .returning();

    if (!updated.length) return apiError("Coupon not found", 404);
    return apiSuccess(updated[0]);
  } catch {
    return apiError("Failed to update coupon", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: _req.headers });
    if (!session || (session.user as Record<string, unknown>).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { code } = await params;
    const deleted = await db.delete(schema.coupons).where(eq(schema.coupons.code, code.toUpperCase())).returning();
    if (!deleted.length) return apiError("Coupon not found", 404);
    return apiSuccess({ success: true });
  } catch {
    return apiError("Failed to delete coupon", 500);
  }
}
