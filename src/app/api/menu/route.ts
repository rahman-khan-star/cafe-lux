import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { validateRequest, apiError, apiSuccess } from "@/lib/api-utils";
import { menuItemSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const items = await db.query.menuItems.findMany({
      with: { category: true },
      orderBy: [desc(schema.menuItems.createdAt)],
    });
    return apiSuccess(items);
  } catch {
    return apiError("Failed to fetch menu items", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || (session.user as Record<string, unknown>).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const body = await req.json();
    const validation = validateRequest(menuItemSchema, body);
    if (!validation.success) return apiError(validation.error);

    const id = `food-${Date.now()}`;
    const data = validation.data;
    const item = await db.insert(schema.menuItems).values({
      id,
      name: data.name,
      description: data.description,
      price: String(data.price),
      originalPrice: data.originalPrice ? String(data.originalPrice) : null,
      categoryId: data.categoryId,
      image: data.image,
      prepTime: data.prepTime,
      calories: data.calories,
      ingredients: data.ingredients,
      rating: String(data.rating),
      featured: data.featured,
      badge: data.badge || null,
      available: data.available,
    }).returning();
    return apiSuccess(item[0], 201);
  } catch {
    return apiError("Failed to create menu item", 500);
  }
}
