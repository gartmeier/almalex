import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";

export function useLanguageRedirect(expectedLanguage: string) {
  let { i18n } = useTranslation();
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    if (i18n.language !== expectedLanguage) {
      let currentPath = location.pathname;
      let pathParts = currentPath.split("/").filter(Boolean);
      
      // Handle different path patterns
      if (pathParts[0] === expectedLanguage) {
        // Replace the language prefix
        pathParts[0] = i18n.language;
        let newPath = "/" + pathParts.join("/");
        navigate(newPath, { replace: true });
      } else {
        // This shouldn't happen if routes are set up correctly
        // But as a fallback, navigate to the language home
        navigate(`/${i18n.language}`, { replace: true });
      }
    }
  }, [i18n.language, expectedLanguage, navigate, location.pathname]);
}
