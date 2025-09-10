import { HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import "~/lib/i18n";
import { Button } from "../ui/button";
import { ReportIssueButton } from "./report-issue-button";

export function HelpMenu() {
  let { t, i18n } = useTranslation();
  let language = i18n.language;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon">
          <HelpCircle />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={`/${language}/faq`}>{t("navigation.faq")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/${language}/policies`}>{t("navigation.policies")}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ReportIssueButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
