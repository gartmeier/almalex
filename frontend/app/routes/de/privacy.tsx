import { useTranslation } from "react-i18next";

export default function Component() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">{t("pages.privacy.heading")}</h1>
      {/* Privacy content will go here */}
    </div>
  );
}
