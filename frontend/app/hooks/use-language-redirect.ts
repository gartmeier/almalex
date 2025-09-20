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

      if (pathParts[0] === expectedLanguage) {
        pathParts[0] = i18n.language;
        let newPath = "/" + pathParts.join("/");
        navigate(newPath, { replace: true });
      }
    }
  }, [i18n.language, expectedLanguage, navigate, location.pathname]);
}
