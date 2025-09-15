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
  let { t, i18n } = useTranslation();
  let navigate = useNavigate();
  let location = useLocation();

  let languages = [
    { code: "de", label: "Deutsch" },
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
  ];

  function handleLanguageChange(newLanguage: string) {
    i18n.changeLanguage(newLanguage);

    // Navigate to the same page in the new language
    let currentPath = location.pathname;
    let supportedLanguages = ["de", "fr", "en"];

    // Check if current path has a language prefix
    let pathParts = currentPath.split("/").filter(Boolean);
    let firstPart = pathParts[0];

    if (supportedLanguages.includes(firstPart)) {
      // Replace existing language prefix
      pathParts[0] = newLanguage;
      navigate("/" + pathParts.join("/"));
    } else {
      // Path without language prefix (like /chat/*) - don't change
      // Just change the i18n language
    }
  }

  let currentLanguage = languages.find((lang) => lang.code === i18n.language);

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
