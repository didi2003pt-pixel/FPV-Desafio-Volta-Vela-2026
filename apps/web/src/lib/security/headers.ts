import { buildContentSecurityPolicy } from "@desafio/operations";

export function securityHeaders(input: {
  nonce: string;
  production: boolean;
  appUrl: string;
  s3Endpoint?: string;
  reportOnly?: boolean;
}): Record<string, string> {
  const connectOrigins = [new URL(input.appUrl).origin];
  if (input.s3Endpoint) {
    try {
      connectOrigins.push(new URL(input.s3Endpoint).origin);
    } catch {
      // Environment validation reports an invalid URL before the server becomes ready.
    }
  }

  const policy = buildContentSecurityPolicy({
    nonce: input.nonce,
    production: input.production,
    connectOrigins,
    reportUri: "/api/security/csp-report",
  });

  return {
    [input.reportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy"]: policy,
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Origin-Agent-Cluster": "?1",
  };
}
