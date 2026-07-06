import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { validateRequest, apiError, apiSuccess } from "@/lib/api-utils";
import { reservationSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return apiError("Unauthorized", 401);

    const user = session.user as Record<string, unknown>;
    const isAdmin = user.role === "admin";

    const reservations = await db.query.reservations.findMany({
      where: isAdmin ? undefined : eq(schema.reservations.userId, session.user.id),
      orderBy: [desc(schema.reservations.createdAt)],
    });
    return apiSuccess(reservations);
  } catch {
    return apiError("Failed to fetch reservations", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return apiError("Unauthorized", 401);

    const body = await req.json();
    const validation = validateRequest(reservationSchema, body);
    if (!validation.success) return apiError(validation.error);

    const id = `res-${Date.now()}`;
    const reservation = await db.insert(schema.reservations).values({
      id,
      userId: session.user.id,
      ...validation.data,
    }).returning();

    return apiSuccess(reservation[0], 201);
  } catch {
    return apiError("Failed to create reservation", 500);
  }
}
