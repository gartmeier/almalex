import { useTranslation } from "react-i18next";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export default function Component() {
  let { t } = useTranslation();
  useLanguageRedirect("de");

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">{t("pages.privacy.heading")}</h1>
      {/* Privacy content will go here */}
    </div>
  );
}
