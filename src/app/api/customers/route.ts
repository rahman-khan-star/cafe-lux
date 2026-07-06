import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || (session.user as Record<string, unknown>).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const customers = await db.query.users.findMany({
      orderBy: [desc(schema.users.createdAt)],
    });
    return apiSuccess(customers);
  } catch {
    return apiError("Failed to fetch customers", 500);
  }
}
