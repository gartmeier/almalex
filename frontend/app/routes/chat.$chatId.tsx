import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

export function clientLoader() {}

export default function ChatIdRedirect() {
  let { i18n } = useTranslation();
  let navigate = useNavigate();
  let { chatId } = useParams();

  useEffect(() => {
    let lang = ["de", "fr", "en"].includes(i18n.language)
      ? i18n.language
      : "de";
    navigate(`/${lang}/chat/${chatId}`, { replace: true });
  }, [i18n.language, navigate, chatId]);

  return null;
}
