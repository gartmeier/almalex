import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router";
import { Button } from "~/components/ui/button";
import { LanguageSelector } from "~/components/layout/language-selector";
import { Navigation } from "~/components/layout/navigation";

const queryClient = new QueryClient();

export default function Layout() {
  let { t } = useTranslation();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <header className="flex items-center justify-between p-4">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <div className="font-semibold">{t("app.title")}</div>
            <div className="text-sm text-muted-foreground">
              {t("app.subtitle")}
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild size="sm" variant="outline">
              <Link to="/">
                <SquarePen className="h-4 w-4 mr-2" />
                {t("chat.new")}
              </Link>
            </Button>
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
