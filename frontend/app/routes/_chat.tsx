import { CircleHelp, SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useParams } from "react-router";
import { LanguageSelector } from "~/components/layout/language-selector";
import { ThemeToggle } from "~/components/layout/theme-toggle";
import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";

export default function Layout() {
  let { t } = useTranslation();
  let { lang } = useParams();
  let prefix = `/${lang ?? "de"}`;

  return (
    <>
      <header className="bg-card/[0.93] border-border sticky top-0 z-50 flex items-center justify-between border-b px-6 py-3 backdrop-blur-md backdrop-saturate-150 md:px-10">
        <Link
          to={`${prefix}/chat`}
          className="flex items-center gap-2 transition-all hover:opacity-90"
        >
          <img
            src="/logo-color.webp"
            alt="Alma Lex"
            className="h-[22px] w-[22px] dark:hidden"
          />
          <img
            src="/logo-blue.svg"
            alt="Alma Lex"
            className="hidden h-[22px] w-[22px] dark:block"
          />
          <span className="text-secondary-foreground text-xl font-bold">
            {t("app.title")}
          </span>
        </Link>
        <nav className="flex items-center gap-2" role="navigation">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="hidden sm:inline-flex"
          >
            <Link to={`${prefix}/chat`}>
              <SquarePen className="mr-2 h-4 w-4" />
              {t("chat.new")}
            </Link>
          </Button>
          <Button asChild size="icon" variant="outline" className="sm:hidden">
            <Link to={`${prefix}/chat`} aria-label={t("chat.new")}>
              <SquarePen className="h-4 w-4" />
            </Link>
          </Button>
          <LanguageSelector />
          <ThemeToggle />
          <Button asChild variant="ghost" size="icon">
            <a
              href={`mailto:hello@almalex.ch?subject=${encodeURIComponent(t("support.subject"))}&body=${encodeURIComponent(t("support.body"))}`}
              title={t("navigation.reportIssue")}
              aria-label={t("navigation.reportIssue")}
            >
              <CircleHelp className="h-4 w-4" />
            </a>
          </Button>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </>
  );
}
