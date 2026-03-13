import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import "~/lib/i18n";

export function LanguageSelector() {
  let { i18n } = useTranslation();
  let navigate = useNavigate();
  let location = useLocation();

  let languages = [
    { code: "de", label: "Deutsch" },
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
  ];

  function handleLanguageChange(newLanguage: string) {
    i18n.changeLanguage(newLanguage);

    let currentPath = location.pathname;
    let supportedLanguages = ["de", "fr", "en"];

    let pathParts = currentPath.split("/").filter(Boolean);
    let firstPart = pathParts[0];

    if (supportedLanguages.includes(firstPart)) {
      pathParts[0] = newLanguage;
      navigate("/" + pathParts.join("/"));
    } else {
      // Non-locale paths - just change the i18n language
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={i18n.language}
          onValueChange={handleLanguageChange}
        >
          {languages.map((lang) => (
            <DropdownMenuRadioItem key={lang.code} value={lang.code}>
              {lang.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
