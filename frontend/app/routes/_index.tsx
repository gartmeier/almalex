import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function RootIndex() {
  let { i18n } = useTranslation();
  let navigate = useNavigate();

  useEffect(() => {
    let lang = ["de", "fr", "en"].includes(i18n.language) ? i18n.language : "de";
    navigate(`/${lang}`, { replace: true });
  }, [i18n.language, navigate]);

  return null;
}
