import { NextResponse } from "next/server";
import { z } from "zod";

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string; details?: Record<string, string> } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };

  const details: Record<string, string> = {};
  const issues = result.error.issues || [];
  issues.forEach((err) => {
    const field = err.path.join(".");
    details[field] = err.message;
  });

  return { success: false, error: "Validation failed", details };
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}
