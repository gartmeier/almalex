import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import * as Sentry from "@sentry/react";
import React from "react";
import type { Route } from "./+types/root";
import "./app.css";
import { ChatStorageProvider } from "./contexts/chat-storage";
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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, interactive-widget=resizes-content"
        />
        <link rel="icon" href="/logo-color.svg" type="image/svg+xml" />
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
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  client.setConfig({ baseUrl: "/" });
  return (
    <ChatStorageProvider>
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>
    </ChatStorageProvider>
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
