import { NextRequest, NextResponse } from "next/server";

const rateLimit = new Map<string, { count: number; lastReset: number }>();

function getRateLimit(ip: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now - record.lastReset > windowMs) {
    rateLimit.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= limit) return false;
  record.count++;
  return true;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/")) {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";

    if (!getRateLimit(ip, 100, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    if (!getRateLimit(`auth-${ip}`, 20, 60000) && pathname.startsWith("/api/auth")) {
      return NextResponse.json({ error: "Too many auth requests" }, { status: 429 });
    }
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("better-auth.session_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  const response = NextResponse.next();

  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
