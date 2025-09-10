import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router";
import { LanguageSelector } from "~/components/layout/language-selector";
import { Navigation } from "~/components/layout/navigation";
import { Button } from "~/components/ui/button";

const queryClient = new QueryClient();

export default function Layout() {
  let { t } = useTranslation();
  return (
    <QueryClientProvider client={queryClient}>
      <header className="fixed flex w-full items-center justify-between p-4">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <div className="font-semibold">{t("app.title")}</div>
          <div className="text-muted-foreground text-sm">
            {t("app.subtitle")}
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Button asChild size="sm" variant="outline">
            <Link to="/">
              <SquarePen className="mr-2 h-4 w-4" />
              {t("chat.new")}
            </Link>
          </Button>
          <LanguageSelector />
          <Navigation />
        </div>
      </header>
      <main className="min-h-screen">
        <Outlet />
      </main>
    </QueryClientProvider>
  );
}
