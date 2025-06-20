import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createToken } from "~/lib/api";
import { client as apiClient } from "~/lib/api/client.gen";
import type { Route } from "./+types/root";
import "./app.css";

const queryClient = new QueryClient();

export function meta() {
  return [
    { title: "Alma Lex" },
    { name: "description", content: "Welcome to Alma Lex!" },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function clientLoader() {
  apiClient.setConfig({ baseUrl: "/" });

  let token = await getOrCreateToken();

  apiClient.setConfig({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return { token };
}

async function getOrCreateToken() {
  let token = localStorage.getItem("token");
  if (!token) {
    let { data } = await createToken();
    token = data!.access_token;
    localStorage.setItem("token", token);
  }
  return token;
}

export function HydrateFallback() {
  return null;
}

export default function App() {
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
