import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { validateRequest, apiError, apiSuccess } from "@/lib/api-utils";
import { categorySchema } from "@/lib/validators";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const cats = await db.query.categories.findMany({ orderBy: [schema.categories.sortOrder] });
    return apiSuccess(cats);
  } catch {
    return apiError("Failed to fetch categories", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || (session.user as Record<string, unknown>).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const body = await req.json();
    const validation = validateRequest(categorySchema, body);
    if (!validation.success) return apiError(validation.error);

    const id = validation.data.name.toLowerCase().replace(/\s+/g, "-");
    const cat = await db.insert(schema.categories).values({ id, ...validation.data }).returning();
    return apiSuccess(cat[0], 201);
  } catch {
    return apiError("Failed to create category", 500);
  }
}
