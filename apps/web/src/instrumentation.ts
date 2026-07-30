import { logger } from "./lib/observability/logger";

export function register(): void {
  logger.info("server_started", {
    nodeVersion: process.version,
    runtime: process.env.NEXT_RUNTIME ?? "nodejs",
  });
}

export async function onRequestError(
  error: Error & { digest?: string },
  request: { path: string; method: string; headers: Record<string, string | string[]> },
  context: {
    routePath: string;
    routeType: string;
    routerKind: string;
  },
): Promise<void> {
  logger.error("next_request_error", {
    error: error.message,
    digest: error.digest,
    requestPath: request.path,
    method: request.method,
    requestId: request.headers["x-request-id"],
    routePath: context.routePath,
    routeType: context.routeType,
    routerKind: context.routerKind,
  });
}
