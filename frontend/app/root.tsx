import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense, useEffect } from "react";
import { client } from "~/lib/api/client.gen";
import { ensureServerToken, tokenCookie } from "~/server/auth.server";
import type { Route } from "./+types/root";
import "./app.css";

const queryClient = new QueryClient();

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

export async function loader({ request }: Route.LoaderArgs) {
  let url = new URL(request.url);

  if (url.pathname === "/") {
    throw redirect("/chat");
  }

  let token = await ensureServerToken(request);

  return data(
    { token },
    { headers: { "Set-Cookie": await tokenCookie.serialize(token) } },
  );
}

export function meta() {
  return [
    { title: "Alma Lex" },
    { name: "description", content: "Welcome to Alma Lex!" },
  ];
}

export default function App({ loaderData }: Route.ComponentProps) {
  let { token } = loaderData;

  useEffect(() => {
    client.setConfig({
      baseUrl: "/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={"Loading..."}>
        <Outlet />
      </Suspense>
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
