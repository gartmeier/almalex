import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function LanguageSelector() {
  let { i18n } = useTranslation();
  let fetcher = useFetcher();

  let languages = [
    { code: "de", label: "Deutsch" },
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
  ];

  function handleLanguageChange(newLanguage: string) {
    fetcher.submit(
      {
        language: newLanguage,
      },
      {
        method: "post",
        action: "/",
      },
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={lang.code === i18n.language ? "font-semibold" : ""}
          >
            <span>{lang.label}</span>
            {lang.code === i18n.language && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

