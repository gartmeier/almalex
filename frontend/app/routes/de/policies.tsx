import { useTranslation } from "react-i18next";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export default function Component() {
  let { t } = useTranslation();
  useLanguageRedirect("de");

  return (
    <div className="p-4">
      <h1 className="mb-6 text-3xl font-bold">{t("pages.policies.heading")}</h1>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("pages.policies.privacy.heading")}
          </h2>
          <div className="prose max-w-none">
            {/* Privacy policy content will go here */}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t("pages.policies.terms.heading")}
          </h2>
          <div className="prose max-w-none">
            {/* Terms of service content will go here */}
          </div>
        </section>
      </div>
    </div>
  );
}
