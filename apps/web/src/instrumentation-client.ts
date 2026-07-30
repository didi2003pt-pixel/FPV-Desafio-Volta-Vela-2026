try {
  performance.mark("desafio-app-init");
} catch {
  // Client instrumentation must never prevent the application from loading.
}

export function onRouterTransitionStart(
  url: string,
  navigationType: "push" | "replace" | "traverse",
): void {
  try {
    performance.mark(`desafio-nav-${navigationType}-${url.slice(0, 80)}-${Date.now()}`);
  } catch {
    // No personal data or analytics are transmitted from this file.
  }
}
