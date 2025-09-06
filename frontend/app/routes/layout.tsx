import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { LanguageSelector } from "~/components/layout/language-selector";
import { Navigation } from "~/components/layout/navigation";

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <header className="flex items-center justify-between p-4">
          <div>
            <div className="font-semibold">Alma Lex</div>
            <div className="text-sm text-gray-600">
              Schweizer AI Rechtsberatung
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Navigation />
            <LanguageSelector />
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </QueryClientProvider>
    </>
  );
}
