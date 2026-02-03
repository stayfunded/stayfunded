// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protect /admin/* with Basic Auth (v0-safe).
// This avoids relying on client cookies/sessions for admin protection.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const user = process.env.ADMIN_BASIC_USER || "";
  const pass = process.env.ADMIN_BASIC_PASS || "";

  // If creds are not set, fail closed (block access)
  if (!user || !pass) {
    return new NextResponse("Admin not configured", { status: 401 });
  }

  const authHeader = req.headers.get("authorization") || "";
  const [scheme, encoded] = authHeader.split(" ");

  if (scheme === "Basic" && encoded) {
    try {
      const decoded = Buffer.from(encoded, "base64").toString("utf8");
      const sep = decoded.indexOf(":");
      const u = sep >= 0 ? decoded.slice(0, sep) : "";
      const p = sep >= 0 ? decoded.slice(sep + 1) : "";

      if (u === user && p === pass) {
        return NextResponse.next();
      }
    } catch {
      // fall through to challenge
    }
  }

  // Challenge
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="StayFunded Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
