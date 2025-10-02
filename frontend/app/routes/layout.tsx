import * as Sentry from "@sentry/react";
import { SquarePen } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router";
import { HelpMenu } from "~/components/layout/help-menu";
import { LanguageSelector } from "~/components/layout/language-selector";
import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";
import logoSrc from "~/assets/logo.svg";

export default function Layout() {
  let { t } = useTranslation();
  let formRef = useRef<any>(null);

  async function openFeedback() {
    if (!formRef.current) {
      let feedback = Sentry.getFeedback();
      if (feedback) {
        formRef.current = await feedback.createForm();
        formRef.current.appendToDom();
      }
    }

    if (formRef.current) {
      formRef.current.open();
    }
  }

  return (
    <>
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link
            to="/"
            className="group flex items-center gap-3 transition-all hover:opacity-90"
          >
            <img src={logoSrc} alt="" className="h-10 w-10" />
            <div className="flex flex-col justify-center">
              <h1 className="text-lg leading-tight font-semibold">
                {t("app.title")}
              </h1>
              <p className="text-muted-foreground text-xs">{t("app.subtitle")}</p>
            </div>
          </Link>
          <nav className="flex items-center gap-2" role="navigation">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden sm:inline-flex"
            >
              <Link to="/" aria-label={t("chat.new")}>
                <SquarePen className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>{t("chat.new")}</span>
              </Link>
            </Button>
            <Button asChild size="icon" variant="outline" className="sm:hidden">
              <Link to="/" aria-label={t("chat.new")}>
                <SquarePen className="h-4 w-4" />
              </Link>
            </Button>
            <LanguageSelector />
            <HelpMenu onOpenFeedback={openFeedback} />
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
