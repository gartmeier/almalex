import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function HomePage() {
  let navigate = useNavigate();
  let { i18n } = useTranslation();

  useEffect(() => {
    // Redirect to language-specific home page
    let lang = i18n.language;
    if (lang === "de" || lang === "fr" || lang === "en") {
      navigate(`/${lang}`, { replace: true });
    } else {
      // Default to German if language is not supported
      navigate("/de", { replace: true });
    }
  }, [i18n.language, navigate]);

  // Show nothing while redirecting
  return null;
}

