import { SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router";
import { HelpMenu } from "~/components/layout/help-menu";
import { LanguageSelector } from "~/components/layout/language-selector";
import { ThemeToggle } from "~/components/layout/theme-toggle";
import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";

export default function Layout() {
  let { t } = useTranslation();

  return (
    <>
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link
            to="/"
            className="group flex flex-col justify-center transition-all hover:opacity-90"
          >
            <h1 className="text-lg leading-tight font-semibold">
              {t("app.title")}
            </h1>
            <p className="text-muted-foreground text-xs">{t("app.subtitle")}</p>
          </Link>
          <nav className="flex items-center gap-2" role="navigation">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden sm:inline-flex"
            >
              <Link to="/chat" aria-label={t("chat.new")}>
                <SquarePen className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>{t("chat.new")}</span>
              </Link>
            </Button>
            <Button asChild size="icon" variant="outline" className="sm:hidden">
              <Link to="/chat" aria-label={t("chat.new")}>
                <SquarePen className="h-4 w-4" />
              </Link>
            </Button>
            <ThemeToggle />
            <LanguageSelector />
            <HelpMenu />
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </>
  );
}
