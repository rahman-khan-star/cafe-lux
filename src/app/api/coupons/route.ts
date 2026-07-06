import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";
import { validateRequest, apiError, apiSuccess } from "@/lib/api-utils";
import { couponSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const couponsList = await db.query.coupons.findMany({
      orderBy: [desc(schema.coupons.createdAt)],
    });
    return apiSuccess(couponsList);
  } catch {
    return apiError("Failed to fetch coupons", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || (session.user as Record<string, unknown>).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const body = await req.json();
    const validation = validateRequest(couponSchema, body);
    if (!validation.success) return apiError(validation.error);

    const d = validation.data;
    const coupon = await db.insert(schema.coupons).values({
      code: d.code,
      discount: String(d.discount),
      type: d.type,
      minOrder: String(d.minOrder),
      active: d.active,
      usageLimit: d.usageLimit || null,
      expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
    }).returning();

    return apiSuccess(coupon[0], 201);
  } catch {
    return apiError("Failed to create coupon", 500);
  }
}
