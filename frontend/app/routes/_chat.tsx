import { SquarePen } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useParams } from "react-router";
import { LanguageSelector } from "~/components/layout/language-selector";
import { ThemeToggle } from "~/components/layout/theme-toggle";
import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";

export default function Layout() {
  let { t, i18n } = useTranslation();
  let { lang } = useParams();
  let prefix = `/${lang ?? "de"}`;

  useEffect(() => {
    if (lang && ["de", "fr", "en"].includes(lang)) {
      i18n.changeLanguage(lang);
      document.documentElement.lang = lang;
    }
  }, [lang, i18n]);

  return (
    <>
      <header className="bg-card/[0.93] border-border sticky top-0 z-50 flex items-center justify-between border-b px-6 py-3 backdrop-blur-md backdrop-saturate-150 md:px-10">
        <Link
          to={prefix}
          className="flex items-center gap-2 transition-all hover:opacity-90"
        >
          <img
            src="/logo-color.webp"
            alt="Alma Lex"
            className="h-[22px] w-[22px]"
          />
          <span className="text-secondary-foreground text-xl font-bold">
            {t("app.title")}
          </span>
        </Link>
        <nav className="flex items-center gap-3" role="navigation">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="hidden sm:inline-flex"
          >
            <Link to={`${prefix}/chat`} aria-label={t("chat.new")}>
              <SquarePen className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>{t("chat.new")}</span>
            </Link>
          </Button>
          <Button asChild size="icon" variant="outline" className="sm:hidden">
            <Link to={`${prefix}/chat`} aria-label={t("chat.new")}>
              <SquarePen className="h-4 w-4" />
            </Link>
          </Button>
          <ThemeToggle />
          <LanguageSelector />
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </>
  );
}
