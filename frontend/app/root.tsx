import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";

import * as Sentry from "@sentry/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Negotiator from "negotiator";
import React, { useMemo } from "react";
import type { Route } from "./+types/root";
import "./app.css";
import { Navigation } from "./components/layout/navigation";
import i18n from "./lib/i18n";

if (!import.meta.env.DEV) {
  Sentry.init({
    dsn: "https://59642c617b7a23eba28dcec56846eaf9@o4507063971020800.ingest.us.sentry.io/4509672193785856",
    integrations: [
      Sentry.feedbackIntegration({
        colorScheme: "system",
      }),
    ],
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  let negotiator = Negotiator(request);

  let availableLanguages = ["de", "fr", "en"];
  let currentLanguage = negotiator.language(availableLanguages);

  return { language: currentLanguage };
}

export function meta() {
  return [
    { title: "Alma Lex" },
    { name: "description", content: "Welcome to Alma Lex!" },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  let { language } = useRouteLoaderData<typeof loader>("root")!;

  return (
    <html lang={language} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, interactive-widget=resizes-content"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              let darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
              
              function updateDarkMode() {
                if (darkModeQuery.matches) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              }
              
              // Set initial dark mode
              updateDarkMode();
              
              // Listen for changes
              darkModeQuery.addEventListener('change', updateDarkMode);
            })();
          `,
          }}
        />
        <header className="flex items-center justify-between p-4">
          <div>
            <div className="font-semibold">Alma Lex</div>
            <div className="text-sm text-gray-600">
              Schweizer AI Rechtsberatung
            </div>
          </div>
          <Navigation />
        </header>
        <main className="flex-1">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const queryClient = useMemo(() => new QueryClient(), []);

  useMemo(() => {
    if (loaderData.language !== i18n.language) {
      i18n.changeLanguage(loaderData.language);
    }
  }, [loaderData.language]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
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
