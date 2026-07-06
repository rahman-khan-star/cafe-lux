import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: _req.headers });
    if (!session || (session.user as Record<string, unknown>).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { id } = await params;
    const deleted = await db.delete(schema.reviews).where(eq(schema.reviews.id, id)).returning();
    if (!deleted.length) return apiError("Review not found", 404);
    return apiSuccess({ success: true });
  } catch {
    return apiError("Failed to delete review", 500);
  }
}
