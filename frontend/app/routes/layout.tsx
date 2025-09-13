import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
import { SquarePen } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router";
import { HelpMenu } from "~/components/layout/help-menu";
import { LanguageSelector } from "~/components/layout/language-selector";
import { Button } from "~/components/ui/button";

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link
            to="/"
            className="group flex flex-col justify-center transition-all hover:opacity-90"
            aria-label={t("app.title")}
          >
            <h1 className="text-lg leading-tight font-semibold">
              {t("app.title")}
            </h1>
            <p className="text-muted-foreground text-xs">{t("app.subtitle")}</p>
          </Link>
          <nav
            className="flex items-center gap-2"
            role="navigation"
            aria-label="Main navigation"
          >
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
    </QueryClientProvider>
  );
}
