import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-mono">
      <div className="max-w-md text-center">
        <p className="text-primary text-glow text-sm tracking-[0.3em]">SYS_ERR // 404</p>
        <h1 className="mt-2 text-7xl font-display text-foreground text-glow">NODE_LOST</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This sector is not on the Somnia grid. Return to the Firewall.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-primary px-4 py-2 text-sm text-primary text-glow hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            ← RETURN_TO_TERMINAL
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-mono">
      <div className="max-w-md text-center">
        <p className="text-alert text-glow text-sm tracking-[0.3em]">SYS_HALT</p>
        <h1 className="mt-2 text-4xl font-display text-foreground text-glow">
          KERNEL_PANIC
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Terminal V4.2 encountered an unexpected fault. Retry or return to root.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="border border-primary px-4 py-2 text-sm text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            RETRY_NODE
          </button>
          <a href="/" className="border border-border px-4 py-2 text-sm text-foreground hover:border-primary">
            RETURN_HOME
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SOMNIA FIREWALL" },
      {
        name: "description",
        content:
          "Analog-horror control terminal for the Somnia Firewall. Track cognitive leaks, reroute coolant, and purge nightmares before reality overwrites itself.",
      },
      { name: "author", content: "Team Toodles" },
      { property: "og:title", content: "SOMNIA FIREWALL" },
      {
        property: "og:description",
        content: "Analog-horror control terminal for the Somnia Firewall. Track cognitive leaks, reroute coolant, and purge nightmares before reality overwrites itself.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SOMNIA FIREWALL" },
      { name: "twitter:description", content: "Analog-horror control terminal for the Somnia Firewall. Track cognitive leaks, reroute coolant, and purge nightmares before reality overwrites itself." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a12ac415-51b9-469b-8ecc-5b349d1e90b1/id-preview-daf44514--bbca8b56-50e9-428e-8c29-1bf01eec0fe8.lovable.app-1784130279914.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a12ac415-51b9-469b-8ecc-5b349d1e90b1/id-preview-daf44514--bbca8b56-50e9-428e-8c29-1bf01eec0fe8.lovable.app-1784130279914.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=VT323&family=JetBrains+Mono:wght@300;400;500;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
