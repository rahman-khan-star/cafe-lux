import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { validateRequest, apiError, apiSuccess } from "@/lib/api-utils";
import { categorySchema } from "@/lib/validators";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || (session.user as Record<string, unknown>).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { id } = await params;
    const body = await req.json();
    const validation = validateRequest(categorySchema.partial(), body);
    if (!validation.success) return apiError(validation.error);

    const updated = await db.update(schema.categories)
      .set({ ...validation.data, updatedAt: new Date() })
      .where(eq(schema.categories.id, id))
      .returning();
    if (!updated.length) return apiError("Category not found", 404);
    return apiSuccess(updated[0]);
  } catch {
    return apiError("Failed to update category", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: _req.headers });
    if (!session || (session.user as Record<string, unknown>).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { id } = await params;
    const deleted = await db.delete(schema.categories).where(eq(schema.categories.id, id)).returning();
    if (!deleted.length) return apiError("Category not found", 404);
    return apiSuccess({ success: true });
  } catch {
    return apiError("Failed to delete category", 500);
  }
}
