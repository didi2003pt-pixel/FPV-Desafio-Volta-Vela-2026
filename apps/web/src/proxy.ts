import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createRequestId, isTrustedOrigin } from "@desafio/operations";
import { securityHeaders } from "./lib/security/headers";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const ORIGIN_EXEMPT_PATHS = new Set([
  "/api/security/csp-report",
  "/api/cron/close-markets",
  "/api/cron/recalculate-results",
  "/api/cron/retention",
]);

export function proxy(request: NextRequest) {
  const requestId = createRequestId(request.headers.get("x-request-id"));
  const nonce = randomBytes(18).toString("base64");
  const appUrl = process.env.APP_URL ?? request.nextUrl.origin;
  const trustedOrigins = process.env.TRUSTED_ORIGINS ?? "";
  const path = request.nextUrl.pathname;

  if (UNSAFE_METHODS.has(request.method) && !ORIGIN_EXEMPT_PATHS.has(path)) {
    const origin = request.headers.get("origin");
    const fetchSite = request.headers.get("sec-fetch-site");
    if (
      !isTrustedOrigin(origin, appUrl, trustedOrigins) ||
      fetchSite === "cross-site"
    ) {
      return NextResponse.json(
        { error: "Pedido bloqueado pela política de origem.", requestId },
        { status: 403, headers: { "Cache-Control": "no-store", "X-Request-Id": requestId } },
      );
    }
  }

  const values = securityHeaders({
    nonce,
    production: process.env.NODE_ENV === "production",
    appUrl,
    ...(process.env.S3_ENDPOINT ? { s3Endpoint: process.env.S3_ENDPOINT } : {}),
    reportOnly: process.env.CSP_REPORT_ONLY === "true",
  });
  const csp = values["Content-Security-Policy"]
    ?? values["Content-Security-Policy-Report-Only"];

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);
  requestHeaders.set("x-nonce", nonce);
  if (csp) requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("X-Request-Id", requestId);
  if (path.startsWith("/api/")) response.headers.set("Cache-Control", "no-store");

  for (const [name, value] of Object.entries(values)) response.headers.set(name, value);

  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml|brand/).*)",
  ],
};
