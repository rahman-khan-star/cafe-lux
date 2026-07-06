import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { validateRequest, apiError, apiSuccess } from "@/lib/api-utils";
import { addressSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return apiError("Unauthorized", 401);

    const addrs = await db.query.addresses.findMany({
      where: eq(schema.addresses.userId, session.user.id),
    });
    return apiSuccess(addrs);
  } catch {
    return apiError("Failed to fetch addresses", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return apiError("Unauthorized", 401);

    const body = await req.json();
    const validation = validateRequest(addressSchema, body);
    if (!validation.success) return apiError(validation.error);

    if (validation.data.isDefault) {
      await db.update(schema.addresses)
        .set({ isDefault: false })
        .where(eq(schema.addresses.userId, session.user.id));
    }

    const id = `addr-${Date.now()}`;
    const addr = await db.insert(schema.addresses).values({
      id,
      userId: session.user.id,
      ...validation.data,
    }).returning();

    return apiSuccess(addr[0], 201);
  } catch {
    return apiError("Failed to create address", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return apiError("Unauthorized", 401);

    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return apiError("Address ID required");

    if (data.isDefault) {
      await db.update(schema.addresses)
        .set({ isDefault: false })
        .where(eq(schema.addresses.userId, session.user.id));
    }

    const updated = await db.update(schema.addresses)
      .set(data)
      .where(eq(schema.addresses.id, id))
      .returning();

    if (!updated.length) return apiError("Address not found", 404);
    return apiSuccess(updated[0]);
  } catch {
    return apiError("Failed to update address", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return apiError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return apiError("Address ID required");

    const deleted = await db.delete(schema.addresses).where(eq(schema.addresses.id, id)).returning();
    if (!deleted.length) return apiError("Address not found", 404);
    return apiSuccess({ success: true });
  } catch {
    return apiError("Failed to delete address", 500);
  }
}
