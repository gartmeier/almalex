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

let privacyPaths: Record<string, string> = {
  de: "datenschutz",
  en: "privacy",
  fr: "protection-des-donnees",
};

let termsPaths: Record<string, string> = {
  de: "nutzungsbedingungen",
  en: "terms",
  fr: "conditions-utilisation",
};

export function HelpMenu() {
  let { t, i18n } = useTranslation();
  let language = i18n.language;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <HelpCircle />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={`/${language}/faq`}>{t("navigation.faq")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/${language}/${privacyPaths[language] ?? "datenschutz"}`}>
            {t("navigation.privacy")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to={`/${language}/${termsPaths[language] ?? "nutzungsbedingungen"}`}
          >
            {t("navigation.terms")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="mailto:hello@almalex.ch">{t("navigation.reportIssue")}</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
