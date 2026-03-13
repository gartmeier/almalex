import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export function clientLoader() {}

export default function ChatRedirect() {
  let { i18n } = useTranslation();
  let navigate = useNavigate();

  useEffect(() => {
    let lang = ["de", "fr", "en"].includes(i18n.language)
      ? i18n.language
      : "de";
    navigate(`/${lang}/chat`, { replace: true });
  }, [i18n.language, navigate]);

  return null;
}
