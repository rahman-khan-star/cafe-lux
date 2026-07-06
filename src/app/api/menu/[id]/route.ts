import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { validateRequest, apiError, apiSuccess } from "@/lib/api-utils";
import { menuItemSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await db.query.menuItems.findFirst({
      where: eq(schema.menuItems.id, id),
      with: { category: true },
    });
    if (!item) return apiError("Menu item not found", 404);
    return apiSuccess(item);
  } catch {
    return apiError("Failed to fetch menu item", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || (session.user as Record<string, unknown>).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { id } = await params;
    const body = await req.json();
    const validation = validateRequest(menuItemSchema.partial(), body);
    if (!validation.success) return apiError(validation.error);

    const data = validation.data;
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = String(data.price);
    if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice ? String(data.originalPrice) : null;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.prepTime !== undefined) updateData.prepTime = data.prepTime;
    if (data.calories !== undefined) updateData.calories = data.calories;
    if (data.ingredients !== undefined) updateData.ingredients = data.ingredients;
    if (data.rating !== undefined) updateData.rating = String(data.rating);
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.badge !== undefined) updateData.badge = data.badge;
    if (data.available !== undefined) updateData.available = data.available;

    const updated = await db.update(schema.menuItems)
      .set(updateData)
      .where(eq(schema.menuItems.id, id))
      .returning();
    if (!updated.length) return apiError("Menu item not found", 404);
    return apiSuccess(updated[0]);
  } catch {
    return apiError("Failed to update menu item", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: _req.headers });
    if (!session || (session.user as Record<string, unknown>).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { id } = await params;
    const deleted = await db.delete(schema.menuItems).where(eq(schema.menuItems.id, id)).returning();
    if (!deleted.length) return apiError("Menu item not found", 404);
    return apiSuccess({ success: true });
  } catch {
    return apiError("Failed to delete menu item", 500);
  }
}
