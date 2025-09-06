import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router";

export function useLanguageRedirect(expectedLanguage: string) {
  let { i18n } = useTranslation();
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    if (i18n.language !== expectedLanguage) {
      // Replace the language part of the current path
      let newPath = location.pathname.replace(
        `/${expectedLanguage}/`,
        `/${i18n.language}/`
      );
      navigate(newPath, { replace: true });
    }
  }, [i18n.language, expectedLanguage, navigate, location.pathname]);
}