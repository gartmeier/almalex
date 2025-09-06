import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export function Navigation() {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  const items = [
    { to: `/${language}/faq`, text: t("navigation.faq") },
    { to: `/${language}/terms`, text: t("navigation.terms") },
    { to: `/${language}/privacy`, text: t("navigation.privacy") },
  ];

  return (
    <nav className="flex gap-6">
      {items.map((item) => (
        <Link key={item.to} to={item.to} className="text-sm hover:underline">
          {item.text}
        </Link>
      ))}
    </nav>
  );
}
