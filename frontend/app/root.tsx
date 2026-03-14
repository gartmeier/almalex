import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import * as Sentry from "@sentry/react";
import type React from "react";
import { useTranslation } from "react-i18next";
import type { Route } from "./+types/root";
import "./app.css";
import { ChatStorageProvider } from "./contexts/chat-storage";
import { ThemeProvider } from "./contexts/theme";
import { client } from "./lib/api/client.gen";
import "./lib/i18n";

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
  });
}

export function meta() {
  return [
    { title: "Alma Lex – Obligationenrecht (OR) einfach erklärt" },
    {
      name: "description",
      content:
        "Fragen zum OR, ZGB oder Bundesgerichtsentscheiden? Alma Lex erklärt Schweizer Recht verständlich – mit Quellenangaben. Kostenlos und ohne Anmeldung.",
    },
  ];
}

export function loader({ request }: Route.LoaderArgs) {
  let cookie = request.headers.get("Cookie") ?? "";
  let match = cookie.match(/(?:^|; )theme=(light|dark|system)/);
  let ssrTheme = (match?.[1] as "light" | "dark" | "system") ?? "system";
  return data({ ssrTheme });
}

function useLang() {
  let { pathname } = useLocation();
  let seg = pathname.split("/").filter(Boolean)[0];
  return ["de", "fr", "en"].includes(seg!) ? seg! : "de";
}

export function Layout({ children }: { children: React.ReactNode }) {
  let lang = useLang();
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, interactive-widget=resizes-content"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <Meta />
        <Links />
        <script
          src="https://cdn.counter.dev/script.js"
          data-id="3e7acdb5-ebd8-4897-b45d-62a3d3c7112b"
          data-utcoffset="1"
        />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              var c = document.cookie.match(/(?:^|; )theme=(light|dark|system)/);
              var stored = c ? c[1] : 'system';
              var dark = stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
              document.documentElement.classList.toggle('dark', dark);
              document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
            })();
          `,
          }}
        />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  client.setConfig({ baseUrl: "/" });
  let { i18n } = useTranslation();
  let lang = useLang();

  // Sync in render (not useEffect) to avoid SSR hydration mismatch.
  // Safe: resources are bundled so changeLanguage is effectively synchronous.
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }

  return (
    <ThemeProvider ssrTheme={loaderData?.ssrTheme}>
      <ChatStorageProvider>
        <TooltipProvider>
          <Outlet />
        </TooltipProvider>
      </ChatStorageProvider>
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
