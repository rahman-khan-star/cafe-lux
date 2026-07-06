import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { validateRequest, apiError, apiSuccess } from "@/lib/api-utils";
import { reviewSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const menuItemId = searchParams.get("menuItemId");

    const where = menuItemId ? eq(schema.reviews.menuItemId, menuItemId) : undefined;
    const reviewsList = await db.query.reviews.findMany({
      where,
      with: { user: true },
      orderBy: [desc(schema.reviews.createdAt)],
    });
    return apiSuccess(reviewsList);
  } catch {
    return apiError("Failed to fetch reviews", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return apiError("Unauthorized", 401);

    const body = await req.json();
    const validation = validateRequest(reviewSchema, body);
    if (!validation.success) return apiError(validation.error);

    const id = `rev-${Date.now()}`;
    const review = await db.insert(schema.reviews).values({
      id,
      userId: session.user.id,
      ...validation.data,
    }).returning();

    return apiSuccess(review[0], 201);
  } catch {
    return apiError("Failed to create review", 500);
  }
}
