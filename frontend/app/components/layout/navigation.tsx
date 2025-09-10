import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { HelpCircle } from "lucide-react";
import * as Sentry from "@sentry/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import "~/lib/i18n";
import { cn } from "~/lib/utils";

export function Navigation() {
  let { t, i18n } = useTranslation();
  let language = i18n.language;

  function handleReportIssue() {
    let feedback = Sentry.getFeedback();
    if (feedback) {
      feedback.openDialog();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        )}
      >
        <HelpCircle className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link to={`/${language}/faq`}>
            {t("navigation.faq")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/${language}/policies`}>
            {t("navigation.policies")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleReportIssue}>
          {t("navigation.reportIssue")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
