import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "seated", "completed", "cancelled"]),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || (session.user as Record<string, unknown>).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { id } = await params;
    const body = await req.json();
    const validation = statusSchema.safeParse(body);
    if (!validation.success) return apiError("Invalid status");

    const updated = await db.update(schema.reservations)
      .set({ status: validation.data.status, updatedAt: new Date() })
      .where(eq(schema.reservations.id, id))
      .returning();

    if (!updated.length) return apiError("Reservation not found", 404);
    return apiSuccess(updated[0]);
  } catch {
    return apiError("Failed to update reservation", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: _req.headers });
    if (!session || (session.user as Record<string, unknown>).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { id } = await params;
    const deleted = await db.delete(schema.reservations).where(eq(schema.reservations.id, id)).returning();
    if (!deleted.length) return apiError("Reservation not found", 404);
    return apiSuccess({ success: true });
  } catch {
    return apiError("Failed to delete reservation", 500);
  }
}
